# CLAUDE.md - cefabmanagement.com

Project rules for this codebase. Read alongside the README.

## Stack

- Next.js 16 (App Router), React 19, TypeScript **strict**, Tailwind CSS v4.
- **Statically generated**: every page is SSG via `generateStaticParams`. No SSR, no
  runtime data fetching.
- **No Supabase, ever.** If you see a Supabase reference, it's a mistake.
- Pages are static, but there are two **server routes**: `/api/contact` and
  `/api/newsletter`. Both use reCAPTCHA v3 (`lib/recaptcha.ts`) plus a honeypot, and
  send through Brevo (`lib/brevo.ts`). Contact mail and newsletter notifications go to
  `directie@cefabmanagement.com` by default (`CONTACT_TO_ADDRESS` /
  `NEWSLETTER_NOTIFY_ADDRESS` override). Newsletter is Brevo double opt-in; env vars in
  README.

## Where things live

- **Content / copy** → `content/en.ts` + `content/nl.ts` (typed `Dictionary`). Keep the
  two locales structurally identical - `content/dictionary.test.ts` enforces parity.
- **Design tokens / CSS** → `app/styles/` (`tokens.css`, `components.css`,
  `layout.css`); Tailwind theme mapping in `app/globals.css`. Do **not** edit
  `../design-reference/` - it's the read-only source-of-truth export the styles were
  ported from.
- **Brand / contact constants** → `lib/site.ts`.
- **Routing** → `lib/routes.ts` (slug map + URL helpers); decision logic in
  `lib/middleware-logic.ts`; edge entry in `proxy.ts` (Next 16's renamed middleware).
- **Insights posts** → `content/insights/<slug>.md`; loader `lib/insights.ts`. Frontmatter:
  `title`, `description` (max 160), `summary`, `date`, `author`, `lang`, optional
  `updated`, `draft`. Slug = filename. Canonical is always the `/en` URL. To publish: add
  the file, run the gate, commit, push to `main`.
- **SEO** → `lib/seo.ts` (alternates + JSON-LD).

## Conventions

- Bump the footer `year` constant in `app/[locale]/layout.tsx` on yearly rebuilds.
- Lint is `eslint .` (Next 16 removed `next lint`).
- Keep `.npmrc`'s `legacy-peer-deps=true` (required for `@vercel/analytics`'s optional
  SvelteKit peer).
- Don't add AI co-authorship trailers to commits.
- **Go easy on em-dashes.** Don't use `—` in copy, comments, or docs; prefer a plain
  hyphen `-` (spaced, ` - `, where a dash is wanted) or restructure the sentence.
  En-dashes `–` are fine in numeric ranges (e.g. `€5–100M`, `10–150`).

## Git workflow

- **Work directly on `main`.** This project commits and pushes straight to `main`
  (also the GitHub default branch) - no feature-branch / `development` flow here.
  This overrides the global git-flow branching convention.
- **Deploy:** push to `main` deploys production on Vercel project
  `cefabmanagement-com-2346` (owns cefabmanagement.com and www). The second project
  `cefabmanagement-com` is unused (to-do: delete). See README "Deploying".

## Before shipping

All of these must pass:

```bash
npm run test && npm run lint && npx tsc --noEmit && npm run build
```
