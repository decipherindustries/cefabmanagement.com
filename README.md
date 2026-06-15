# cefabmanagement.com

Bilingual (NL/EN) statically-generated marketing site for **Catherine Cruickshank ·
Fractional CFO/COO** (CEFAB Management). Built with Next.js 16 (App Router, React 19),
TypeScript (strict), and Tailwind CSS v4. Every page is pre-rendered (SSG) — there is no
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
structurally identical** — `content/dictionary.test.ts` enforces parity (same keys,
same array lengths). Edit the string values; don't change the shape of one without the
other.

## Brand contact + social

Brand contact details and social links are centralised in `lib/site.ts` (email, phone,
LinkedIn). They feed the footer, the About/Contact pages, and the JSON-LD in
`lib/seo.ts`.

- `cvUrl` is currently `null`, so the "Download CV" button is hidden. To enable it: drop
  a PDF at `public/cv-catherine-cruickshank.pdf` and set `cvUrl:
  "/cv-catherine-cruickshank.pdf"` in `lib/site.ts`.

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
- All of this is handled by `proxy.ts` — Next.js 16 renamed the `middleware` file
  convention to `proxy` (same edge runtime + API). The pure decision logic lives in
  `lib/middleware-logic.ts` (unit-tested); the slug map and URL helpers live in
  `lib/routes.ts`.

## Design system

Ported verbatim (token-driven) from the Claude Design export at the repo's **parent**
directory (`../design-reference/`, read-only):

- `app/styles/tokens.css` — design tokens (colors, typography, spacing, elevation) as
  CSS variables.
- `app/styles/components.css` — component CSS (`cc-*`).
- `app/styles/layout.css` — page/section/responsive CSS (`ck-*`).
- `app/globals.css` — imports the above and maps the tokens into Tailwind v4's `@theme`
  so utilities resolve to them.

## Analytics

- **Vercel Analytics** via `<Analytics/>` (`@vercel/analytics`).
- **Google Analytics (GA4)** via `@next/third-parties`.

Both are wired in `app/layout.tsx`. The GA Measurement ID `G-FKVV7HJ6MQ` is baked as the
default and can be overridden with the `NEXT_PUBLIC_GA_ID` env var.

> **`.npmrc`** sets `legacy-peer-deps=true`. This is required: `@vercel/analytics`
> declares an optional SvelteKit peer that npm 11 otherwise tries to resolve into a Vite
> version conflict. Keep it.

## Contact form

The contact form is **front-end only** — it validates and shows a success state but does
not send anything. Wire a backend later in `submitContact()` inside
`components/contact/ContactForm.tsx` (the single seam; e.g. an API route or Resend).

## Deploying (Vercel)

1. Push the repo and import it in Vercel. The framework is auto-detected.
2. **Root Directory = default** — the repo root *is* the Next app.
3. Set environment variables:
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://cefabmanagement.com`) — used for canonical
     URLs, hreflang alternates, sitemap, and JSON-LD.
   - Optionally `NEXT_PUBLIC_GA_ID` to override the default GA ID.
4. Production branch is currently `development`.

The `proxy` runs on Vercel's edge automatically — no extra configuration needed.

## Owner to-dos (later)

- Add the CV PDF and flip `cvUrl` in `lib/site.ts` (see above).
- Replace the portrait with a higher-res original when available
  (`public/portrait-catherine.png`).
- Implement the contact backend in `submitContact()`.
- Swap "Schedule a call" to a real booking URL if desired (currently links to Contact).
