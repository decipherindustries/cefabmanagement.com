# cefabmanagement.com

Bilingual (NL/EN) statically-generated marketing site for **Catherine Cruickshank ·
Fractional CFO/COO** (CEFAB Management). Built with Next.js 16 (App Router, React 19),
TypeScript (strict), and Tailwind CSS v4. Every page is pre-rendered (SSG) - there is no
SSR or runtime data fetching.

## Scripts

```bash
npm run dev        # local dev server (http://localhost:3000)
npm run build      # production build (pre-renders all pages)
npm run start      # serve the production build
npm run test       # vitest (unit + component tests)
npm run lint       # eslint .
npm run typecheck  # tsc --noEmit  (or: npx tsc --noEmit)
```

Before shipping, all of these must pass:

```bash
npm run test && npm run lint && npx tsc --noEmit && npm run build
```

## Editing content

All user-facing copy lives in two typed dictionaries:

- `content/en.ts`
- `content/nl.ts`

Both implement the `Dictionary` type in `content/types.ts`. **Keep the two locales
structurally identical** - `content/dictionary.test.ts` enforces parity (same keys,
same array lengths). Edit the string values; don't change the shape of one without the
other.

## Brand contact + social

Brand contact details and social links are centralised in `lib/site.ts` (email, phone,
LinkedIn). They feed the footer, the About/Contact pages, and the JSON-LD in
`lib/seo.ts`.

The on-site email is **obfuscated** (assembled in JS via `components/ui/ObfuscatedEmail.tsx`)
so it isn't in the static HTML or the JSON-LD - to deter scrapers. The contact form and
LinkedIn are the primary channels.

- `cvUrl` is intentionally `null` (no public CV - credentials live on LinkedIn). To add a
  CV later: drop a PDF at `public/cv-catherine-cruickshank.pdf` and set
  `cvUrl: "/cv-catherine-cruickshank.pdf"` in `lib/site.ts` (the "Download CV" button then
  appears on About).

## Routing

URLs are locale-prefixed with **localised slugs**:

| Page    | EN            | NL              |
|---------|---------------|-----------------|
| Home    | `/en`         | `/nl`           |
| About   | `/en/about`   | `/nl/over-mij`  |
| Contact | `/en/contact` | `/nl/contact`   |

- The root `/` redirects to a locale home based on the browser's `Accept-Language`.
- Requesting an English slug under `/nl` (e.g. `/nl/about`) redirects to the localised
  canonical (`/nl/over-mij`).
- All of this is handled by `proxy.ts` - Next.js 16 renamed the `middleware` file
  convention to `proxy` (same edge runtime + API). The pure decision logic lives in
  `lib/middleware-logic.ts` (unit-tested); the slug map and URL helpers live in
  `lib/routes.ts`.

## Design system

Ported verbatim (token-driven) from the Claude Design export at the repo's **parent**
directory (`../design-reference/`, read-only):

- `app/styles/tokens.css` - design tokens (colors, typography, spacing, elevation) as
  CSS variables.
- `app/styles/components.css` - component CSS (`cc-*`).
- `app/styles/layout.css` - page/section/responsive CSS (`ck-*`).
- `app/globals.css` - imports the above and maps the tokens into Tailwind v4's `@theme`
  so utilities resolve to them.

## Analytics

- **Vercel Analytics** via `<Analytics/>` (`@vercel/analytics`).
- **Google Analytics (GA4)** via `@next/third-parties`.

Both are wired in `app/layout.tsx`. The GA Measurement ID `G-FKVV7HJ6MQ` is baked as the
default and can be overridden with the `NEXT_PUBLIC_GA_ID` env var.

> **`.npmrc`** sets `legacy-peer-deps=true`. This is required: `@vercel/analytics`
> declares an optional SvelteKit peer that npm 11 otherwise tries to resolve into a Vite
> version conflict. Keep it.

## Contact form (Brevo + reCAPTCHA v3)

Submissions POST to the serverless route `app/api/contact/route.ts`, which:

1. drops anything that trips the hidden **honeypot** field (`company_url`),
2. re-validates server-side (`lib/contact-validation.ts`),
3. verifies **Google reCAPTCHA v3** server-side (`lib/recaptcha.ts`) - rejects scores
   below `RECAPTCHA_MIN_SCORE`,
4. sends a branded email via **Brevo** (`lib/brevo.ts` + `lib/contact-email.ts`):
   **To** `CONTACT_TO_ADDRESS`, **From** `BREVO_FROM_ADDRESS` (`noreply@…`), **Reply-To**
   the submitter (so a reply goes straight to them). User input is HTML-escaped.

The form (`components/contact/ContactForm.tsx`) loads reCAPTCHA only when
`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set, and shows sending/success/error states.

**Graceful without config:** if `RECAPTCHA_SECRET_KEY` is unset, captcha verification is
skipped (dev); if `BREVO_API_KEY` is unset, the route returns an error (no email sent).
So the build/tests never need real keys.

To go live, set the env vars (below) and:
- **Brevo:** verify the `cefabmanagement.com` sending domain (DKIM/SPF) and authorise
  `noreply@cefabmanagement.com` as a sender; create an API key.
- **reCAPTCHA v3:** register the site in the reCAPTCHA admin console, add the domain(s),
  and copy the site + secret keys.

## AI / Markdown mode

Every page is also available as Markdown for AI agents, generated statically:

- send `Accept: text/markdown` to any page URL, **or**
- append `.md` (e.g. `/en/about.md`, `/nl/over-mij.md`), **or**
- discover them via `/llms.txt`.

Markdown is rendered from the same dictionaries (`lib/markdown.ts`), served by the static
route `app/m/[[...path]]/route.ts`; `proxy.ts` does the content negotiation. In markdown
mode the contact form becomes get-in-touch instructions (LinkedIn + obfuscated email) and
there is no CV. Browsers are unaffected (they still get HTML).

## Deploying (Vercel)

1. Push the repo and import it in Vercel. The framework is auto-detected.
2. **Root Directory = default** - the repo root *is* the Next app.
3. Set environment variables (see `.env.example`; real values only in Vercel):
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://cefabmanagement.com`) - canonical URLs,
     hreflang, sitemap, JSON-LD.
   - `NEXT_PUBLIC_GA_ID` - optional GA override (a default is baked in).
   - **Contact form:** `BREVO_API_KEY`, `BREVO_FROM_NAME`, `BREVO_FROM_ADDRESS`,
     `CONTACT_TO_ADDRESS`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`,
     `RECAPTCHA_MIN_SCORE` (optional).
4. Set the **production branch to `main`** (Settings → Git → Production Branch). Every
   push to it then deploys automatically.

The `proxy` runs on Vercel's edge automatically - no extra configuration needed.

## Owner to-dos (later)

- Configure Brevo (verify domain + API key) and reCAPTCHA (register site) in Vercel to
  make the contact form send - see "Contact form" above.
- Replace the portrait with a higher-res original when available
  (`public/portrait-catherine.png`).
- Swap "Schedule a call" to a real booking URL if desired (currently links to Contact).
