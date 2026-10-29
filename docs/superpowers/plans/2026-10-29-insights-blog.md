# Insights blog and newsletter sign-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a static "Insights" blog (same posts under `/nl` and `/en`) with SEO, Markdown negotiation, an end-of-article contact + newsletter panel, a Brevo double opt-in newsletter sign-up, and move contact mail to directie@.

**Architecture:** Posts are Markdown files in `content/insights/`, read with `fs` and rendered to HTML at build time by `lib/insights.ts`. Pages are SSG under `app/[locale]/insights/`. The existing `/m/...` Markdown route and proxy are extended to recognise post paths. The newsletter is a client form posting to `app/api/newsletter/route.ts`, which calls Brevo's double opt-in endpoint and emails a notification.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4 + `app/styles/*.css`, Vitest + Testing Library, `marked` + `gray-matter` (new deps), Brevo REST API.

**Spec:** `docs/superpowers/specs/2026-10-29-insights-blog-design.md`

## Global Constraints

- Every page is SSG (`generateStaticParams`); no runtime data fetching on pages. No Supabase.
- No em-dashes (`—`) in copy, comments or docs; use ` - `. En-dashes only in numeric ranges.
- Copy: plain business register, British spelling, sentence case, no rhetoric, no exclamation marks.
- `content/en.ts` and `content/nl.ts` stay structurally identical (`content/dictionary.test.ts`).
- Keep `.npmrc` `legacy-peer-deps=true`. Install deps with plain `npm install <pkg>`.
- Commit straight to `main`. Conventional commits. No AI co-author trailer, no "Generated with" footer. Do not push.
- Canonical for every post is the `/en` URL. Post slug = filename without `.md`.
- Newsletter notify default and contact default recipient: `directie@cefabmanagement.com`.
- Ship gate: `npm run test && npm run lint && npx tsc --noEmit && npm run build`.

## Review Focus

1. Unknown post slug (`/en/insights/nope`, `/en/insights/nope.md`) must 404, not 500 or an empty page. Tests in Tasks 1 and 5.
2. A post with `draft: true` must not appear in lists, sitemap, llms.txt or static params in production. Test in Task 1.
3. Raw HTML inside a post's Markdown (`<script>`) must be escaped, not rendered. Test in Task 1.
4. Newsletter sign-up of an address Brevo already knows must return the normal success, not an error. Test in Task 3.
5. Newsletter route with Brevo env vars missing must return a 500 with a generic error and log the reason, never throw unhandled. Test in Task 3.

---

### Task 1: Post loader and first post

**Files:**
- Create: `lib/insights.ts`, `lib/insights.test.ts`, `content/insights/your-company-should-always-be-90-days-from-a-sale.md`, `lib/__fixtures__/insights/` (test fixtures)
- Modify: `package.json` (deps `marked`, `gray-matter`)

**Interfaces:**
- Produces:
  ```ts
  export interface PostMeta {
    slug: string; title: string; description: string; summary: string;
    date: string; updated?: string; author: string; lang: "en" | "nl";
    readingMinutes: number;
  }
  export interface Post extends PostMeta { html: string; markdown: string } // markdown = body without frontmatter
  export function getAllPosts(dir?: string): PostMeta[]   // newest first, drafts excluded when NODE_ENV === "production"
  export function getPost(slug: string, dir?: string): Post | null
  export function readingMinutes(text: string): number    // ceil(words / 220), min 1
  export function formatPostDate(iso: string, locale: Locale): string // "29 October 2026" / "29 oktober 2026"
  ```
  `dir` defaults to `path.join(process.cwd(), "content/insights")`; tests pass the fixture dir.

- [ ] **Step 1: Install deps** - `npm install marked gray-matter`. Expected: both in `dependencies`.
- [ ] **Step 2: Write failing tests** in `lib/insights.test.ts` against fixtures (`a.md` dated 2026-01-01, `b.md` dated 2026-02-01, `draft.md` with `draft: true`, `html.md` containing `<script>alert(1)</script>`):
  - `getAllPosts(FIX)` returns slugs in order `["b", "a", ...]` (newest first); every item has `readingMinutes >= 1`.
  - With `vi.stubEnv("NODE_ENV", "production")`, `getAllPosts(FIX)` excludes `draft`; `getPost("draft", FIX)` returns `null`.
  - `getPost("nope", FIX)` is `null`; `getPost("../package", FIX)` is `null` (slug must match `/^[a-z0-9-]+$/`).
  - `getPost("html", FIX)!.html` does not contain `<script>` and does contain `&lt;script&gt;`.
  - `getPost("a", FIX)!.markdown` does not start with `---`.
  - `readingMinutes("word ".repeat(221))` is `2`; `readingMinutes("")` is `1`.
  - `formatPostDate("2026-10-29", "en")` is `"29 October 2026"`; `"nl"` gives `"29 oktober 2026"`.
  - The real post loads: `getPost("your-company-should-always-be-90-days-from-a-sale")` has `title` "Your Company Should Always Be 90 Days from a Sale", `date` "2026-10-29", `lang` "en", `description.length <= 160`.
- [ ] **Step 3: Run** `npx vitest run lib/insights.test.ts`. Expected: FAIL (module missing).
- [ ] **Step 4: Implement `lib/insights.ts`.** `gray-matter` for frontmatter; `marked` with `marked.use({ renderer: { html: ({ text }) => escapeHtml(text) } })` so raw HTML is escaped. Use `Intl.DateTimeFormat` with `en-GB` / `nl-NL`, `{ day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }`. Missing required frontmatter (`title`, `description`, `summary`, `date`) throws with the filename, so a bad post fails the build.
- [ ] **Step 5: Create the first post.** Frontmatter:
  ```yaml
  ---
  title: "Your Company Should Always Be 90 Days from a Sale"
  description: "Exit readiness as a monthly standard: auditable financials, a management layer that runs without the founder, a live data room and a two-page summary."
  summary: "A buyer calls and wants a data room in 30 days. Most founders discover they're twelve months from ready, not twelve weeks."
  date: "2026-10-29"
  author: "Catherine Cruickshank"
  lang: "en"
  ---
  ```
  Body: copy verbatim from the vault file `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Fabian's Vault/Projects/CEFAB/CFO/LinkedIn Drafts/Your Company Should Always Be 90 Days from a Sale.md`, from "A buyer calls and wants a data room in 30 days." through "...before anyone asked." Exclude the H1, callouts, the "*Interested in working with me?...*" line, hashtags and the "For Catherine" notes. Keep the numbered list and the `*full due diligence audit*` emphasis.
- [ ] **Step 6: Run** `npx vitest run lib/insights.test.ts`. Expected: PASS.
- [ ] **Step 7: Commit** `feat(insights): load and render markdown posts at build time`.

### Task 2: Routes, dictionary and navigation

**Files:**
- Modify: `lib/routes.ts`, `lib/routes.test.ts`, `content/types.ts`, `content/en.ts`, `content/nl.ts`, `components/layout/Header.tsx`, `components/layout/MobileMenu.tsx`, `components/layout/Footer.tsx`, `lib/markdown.ts` (add an `insights` case so the switch stays exhaustive; see Task 5 for its content - a stub returning the overview title is fine here)

**Interfaces:**
- Produces:
  - `PageKey` gains `"insights"`; `INTERNAL_SLUG.insights = "insights"`; `PUBLIC_SLUG.insights = { nl: "insights", en: "insights" }`.
  - `export function postHref(slug: string, locale: Locale): string` → `/${locale}/insights/${slug}`.
  - `export function parsePostPath(pathname: string): { locale: Locale; slug: string } | null` - matches `/^\/(nl|en)\/insights\/([a-z0-9-]+)\/?$/`.
  - `Dictionary.nav.insights: string`; `Dictionary.meta.insights: { title; description }`; `Dictionary.insights` (below).

```ts
insights: {
  title: string; intro: string; read: string; minRead: string; // "min read"
  breadcrumb: string; subscribed: string;
  panel: { workTitle: string; workBody: string; workCta: string };
  newsletter: { title: string; body: string; placeholder: string; submit: string;
    sending: string; success: string; error: string; note: string };
}
```

Copy (EN / NL):
- nav: "Insights" / "Insights"
- title: "Insights" / "Insights"
- intro: "Articles on finance and operations for scale-ups: exit readiness, reporting and running a company on reliable numbers." / "Artikelen over finance en operations voor scale-ups: exit-gereedheid, rapportage en een bedrijf runnen op betrouwbare cijfers."
- read: "Read" / "Lezen"; minRead: "min read" / "min leestijd"; breadcrumb: "Insights" / "Insights"
- subscribed: "Your subscription is confirmed. New articles will arrive by email." / "Je inschrijving is bevestigd. Nieuwe artikelen ontvang je per e-mail."
- panel.workTitle: "Work with me" / "Samenwerken"; workBody: "Fractional CFO/COO for founders and boards." / "Fractional CFO/COO voor founders en boards."; workCta: "Get in touch" / "Neem contact op"
- newsletter.title: "New insights by email" / "Nieuwe insights per e-mail"; body: "One email when a new article is published." / "Eén e-mail wanneer er een nieuw artikel verschijnt."; placeholder: "you@company.com" / "jij@bedrijf.nl"; submit: "Subscribe" / "Inschrijven"; sending: "Sending..." / "Versturen..."; success: "Check your inbox to confirm your subscription." / "Check je inbox om je inschrijving te bevestigen."; error: "That did not work. Please try again later." / "Dat lukte niet. Probeer het later opnieuw."; note: "Unsubscribe any time." / "Altijd af te melden."
- meta.insights.title: "Insights · Catherine Cruickshank" (both); description: "Articles by Catherine Cruickshank, fractional CFO/COO, on finance and operations for scale-ups." / "Artikelen van Catherine Cruickshank, fractional CFO/COO, over finance en operations voor scale-ups."

- [ ] **Step 1: Write failing tests** in `lib/routes.test.ts`: `href("insights","nl")` is `/nl/insights`; `resolvePublicPath("/en/insights")` is `{ locale: "en", pageKey: "insights" }`; `postHref("x-y","nl")` is `/nl/insights/x-y`; `parsePostPath("/en/insights/x-y")` is `{ locale: "en", slug: "x-y" }`; `parsePostPath("/en/insights")`, `parsePostPath("/de/insights/x")`, `parsePostPath("/en/insights/X_Y")` are `null`.
- [ ] **Step 2: Run** `npx vitest run lib/routes.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** routes, types, dictionary copy above, and nav links. Header and MobileMenu order: Home, About, Insights, FAQ, Contact. Footer links same order. Nav prop types widen to include `insights`.
- [ ] **Step 4: Run** `npx vitest run` (all). Expected: PASS, including `content/dictionary.test.ts` and existing sitemap/llms tests (update any test that hard-codes the page count). `npx tsc --noEmit` passes.
- [ ] **Step 5: Commit** `feat(insights): add insights route, nav entry and dictionary copy`.

### Task 3: Newsletter backend and contact recipient

**Files:**
- Modify: `lib/brevo.ts`, `lib/brevo.test.ts`, `.env.example`
- Create: `app/api/newsletter/route.ts`, `app/api/newsletter/route.test.ts`

**Interfaces:**
- Consumes: `verifyRecaptcha(token, action)` from `lib/recaptcha.ts`.
- Produces:
  ```ts
  // lib/brevo.ts
  export async function subscribeNewsletter(email: string, locale: Locale): Promise<{ ok: boolean; status: number }>
  export async function sendNewsletterNotification(email: string, locale: Locale): Promise<{ ok: boolean; status: number }>
  // POST /api/newsletter  body: { email: string; locale: "nl"|"en"; captchaToken?: string; company_url?: string }
  // responses: 200 {ok:true} | 400 {ok:false,error:"validation"} | 403 {ok:false,error:"captcha"} | 500/502 {ok:false,error:"send-failed"|"send-error"}
  ```

- [ ] **Step 1: Write failing tests.**
  - `lib/brevo.test.ts`: with `CONTACT_TO_ADDRESS` unstubbed (unset), `sendContactEmail` sends `to: [{ email: "directie@cefabmanagement.com" }]`. Existing tests that stub `CONTACT_TO_ADDRESS` keep passing.
  - `subscribeNewsletter`: with `BREVO_NEWSLETTER_LIST_ID=7`, `BREVO_DOI_TEMPLATE_ID=3`, `NEXT_PUBLIC_SITE_URL=https://cefabmanagement.com`, it POSTs to `https://api.brevo.com/v3/contacts/doubleOptinConfirmation` with JSON body `{ email, includeListIds: [7], templateId: 3, redirectionUrl: "https://cefabmanagement.com/nl/insights?subscribed=1"`, `attributes: { LOCALE: "nl" } }`. Responses 201 and 204 → `ok: true`. A 400 whose JSON body has `code: "duplicate_parameter"` → `ok: true`. Other 4xx/5xx → `ok: false` and `console.error` called.
  - `subscribeNewsletter` throws `"BREVO_NEWSLETTER_LIST_ID not set"` / `"BREVO_DOI_TEMPLATE_ID not set"` when missing.
  - `sendNewsletterNotification`: sends to `NEWSLETTER_NOTIFY_ADDRESS` or default `directie@cefabmanagement.com`; subject contains the email and "confirmation pending"; text body contains the locale.
  - `route.test.ts` (mock `@/lib/recaptcha` and `@/lib/brevo` like `app/api/contact/route.test.ts`): honeypot → 200 and nothing called; invalid email (`"x"`, `""`) → 400 `validation`; locale not `nl`/`en` → defaults to `en`; captcha fail → 403 and `verifyRecaptcha` called with action `"newsletter"`; success → 200 and both `subscribeNewsletter` and `sendNewsletterNotification` called; `subscribeNewsletter` throws → 500 `send-error`; `subscribeNewsletter` ok but notification fails → still 200 (subscription matters, notification is best effort, error logged).
- [ ] **Step 2: Run** `npx vitest run lib/brevo.test.ts app/api/newsletter`. Expected: FAIL.
- [ ] **Step 3: Implement.** Change the contact default to `directie@cefabmanagement.com`. Add both Brevo functions sharing the existing api-key header and error-logging style. Email validation: reuse the regex in `lib/contact-validation.ts` (export it if not exported). Route mirrors `app/api/contact/route.ts`. Add to `.env.example` (no values, short comments): `BREVO_NEWSLETTER_LIST_ID=`, `BREVO_DOI_TEMPLATE_ID=`, `NEWSLETTER_NOTIFY_ADDRESS=`.
- [ ] **Step 4: Run** `npx vitest run`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(newsletter): brevo double opt-in sign-up route; contact mail to directie@`.

### Task 4: Newsletter sign-up component

**Files:**
- Create: `components/insights/NewsletterSignup.tsx`, `components/insights/NewsletterSignup.test.tsx`, `components/insights/SubscribedNotice.tsx`

**Interfaces:**
- Consumes: `POST /api/newsletter` (Task 3), `getRecaptchaToken`, `RECAPTCHA_SITE_KEY` from `components/contact/recaptcha.ts`, `Dictionary.insights.newsletter` (Task 2).
- Produces:
  - `export function NewsletterSignup({ dict, locale, tone }: { dict: Dictionary; locale: Locale; tone: "dark" | "light" })` - client component; title, body, email input, submit, note, hidden honeypot `company_url`. States idle/sending/sent/error like `ContactForm`.
  - `export function SubscribedNotice({ message }: { message: string })` - client component; renders `message` in a `role="status"` box only when `window.location.search` contains `subscribed=1` (read in `useEffect`, so the page stays static).

- [ ] **Step 1: Write failing tests** (Testing Library, mock `fetch` and `getRecaptchaToken`): submitting a valid email POSTs `/api/newsletter` with `{ email, locale, captchaToken, company_url: "" }` and then shows `dict.insights.newsletter.success`; an invalid email shows a field error and does not call `fetch`; a non-ok response shows `newsletter.error`; button shows `newsletter.sending` while pending.
- [ ] **Step 2: Run** `npx vitest run components/insights`. Expected: FAIL.
- [ ] **Step 3: Implement** using existing `Input` and `Button` components. Load the reCAPTCHA script with `next/script` as `ContactForm` does (`next/script` dedupes by src). Action name `"newsletter"`.
- [ ] **Step 4: Run** `npx vitest run components/insights`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(newsletter): sign-up form component`.

### Task 5: Insights pages, styling and SEO

**Files:**
- Create: `app/[locale]/insights/page.tsx`, `app/[locale]/insights/[slug]/page.tsx`, `app/[locale]/insights/[slug]/opengraph-image.tsx`, `app/[locale]/insights/[slug]/InstrumentSerif-Regular.ttf` (from Google Fonts, OFL), `components/insights/PostPanel.tsx`
- Modify: `lib/seo.ts`, `lib/seo.test.ts`, `app/styles/components.css`

**Interfaces:**
- Consumes: Tasks 1, 2, 4.
- Produces in `lib/seo.ts`:
  ```ts
  export function postCanonical(slug: string): string            // absolute(postHref(slug, "en"))
  export function blogPostingJsonLd(post: PostMeta): object      // BlogPosting + BreadcrumbList in an @graph
  ```

- [ ] **Step 1: Write failing tests** in `lib/seo.test.ts`: `postCanonical("x")` is `${SITE_URL}/en/insights/x`; `blogPostingJsonLd(meta)` has a `BlogPosting` node with `headline`, `description`, `datePublished` (= `date`), `dateModified` (= `updated ?? date`), `author.name` "Catherine Cruickshank" with `sameAs` containing `SITE.linkedin`, `publisher.name` "CEFAB Management", `mainEntityOfPage` = canonical, `inLanguage` "en"; and a `BreadcrumbList` with 2 items (Insights `/en/insights`, the post).
- [ ] **Step 2: Run** `npx vitest run lib/seo.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement seo helpers.**
- [ ] **Step 4: Build the overview page** following `app/[locale]/faq/page.tsx`: same hero wrap with `Header`, H1 `insights.title`, lead `insights.intro`, `SubscribedNotice`, then the plain list (per post: `formatPostDate · N minRead`, title as an `<h2>` link to `postHref`, summary, "Read →"), then a dark section with `NewsletterSignup tone="dark"`. Metadata: `meta.insights`, `buildAlternates("insights")`, canonical per locale. No `Connect` section (the sign-up replaces it).
- [ ] **Step 5: Build the post page.** `generateStaticParams` = locales × `getAllPosts()` slugs; `dynamicParams = false` so unknown slugs 404; `notFound()` if `getPost` is null. Layout: `Header`, breadcrumb link to the overview, H1, meta line `author · date · N minRead`, `<article lang={post.lang} className="ck-prose" dangerouslySetInnerHTML={{ __html: post.html }} />`, then `PostPanel`. JSON-LD script from `blogPostingJsonLd`. `generateMetadata`: title `${post.title} · Catherine Cruickshank`, description, `alternates: { canonical: postCanonical(slug) }` (no `languages`), `openGraph: { type: "article", publishedTime, modifiedTime, authors: ["Catherine Cruickshank"], url: postCanonical(slug) }` (image comes from the `opengraph-image` file convention).
- [ ] **Step 6: Build `PostPanel`** (server component): dark panel (`--navy-900`, radius-xl), two columns on ≥ 720px, stacked below. Left: `panel.workTitle`, `panel.workBody`, `Button` to `href("contact", locale)` with `panel.workCta`. Right: `NewsletterSignup tone="dark"`. Columns separated by a 1px `--navy-700` divider.
- [ ] **Step 7: Styles** in `app/styles/components.css`: `.ck-prose` (max-width 68ch; Instrument Serif for h2/h3; Karla body `--ink-700`, 1.7 line-height; list spacing; `em` italic), `.ck-post-list` rows with `--ink-200` top borders, `.ck-post-panel` grid. Use existing tokens only.
- [ ] **Step 8: OG image** `opengraph-image.tsx`: `ImageResponse` 1200×630, `--navy-900` background, post title in Instrument Serif (white, ~64px), footer line "Catherine Cruickshank · CFO/COO" in `--on-dark-body`. `generateStaticParams` same as the page; font read with `fs.readFile` from the colocated TTF.
- [ ] **Step 9: Verify.** `npm run build` succeeds and lists `/nl/insights`, `/en/insights`, both post routes and their opengraph images as static (○ or ●). `npm run start` then `curl -s localhost:3000/en/insights/nope -o /dev/null -w '%{http_code}'` prints `404`; `curl -s localhost:3000/nl/insights/your-company-should-always-be-90-days-from-a-sale | grep -o '<link rel="canonical"[^>]*>'` shows the `/en` URL.
- [ ] **Step 10: Commit** `feat(insights): overview and article pages with SEO and OG images`.

### Task 6: Markdown route, llms.txt and sitemap

**Files:**
- Modify: `lib/markdown-routing.ts`, `lib/markdown-routing.test.ts`, `lib/markdown.ts`, `app/m/[[...path]]/route.ts`, `app/llms.txt/route.ts`, `app/sitemap.ts`, `app/sitemap.test.ts`
- Create: `lib/markdown.test.ts` (for `renderPostMarkdown` and the `insights` overview case)

**Interfaces:**
- Consumes: `parsePostPath`, `postHref` (Task 2), `getAllPosts`, `getPost` (Task 1), `postCanonical` (Task 5).
- Produces: `export function renderPostMarkdown(slug: string, locale: Locale): string | null` in `lib/markdown.ts`; `renderMarkdown("insights", locale)` renders the overview as a Markdown list of posts (title linked to the post's `.md` URL, date, summary).

- [ ] **Step 1: Write failing tests.** `mdInternalPathForPublic("/en/insights/abc")` is `/m/en/insights/abc`; `mdInternalPathForPublic("/en/insights")` is `/m/en/insights`; `renderPostMarkdown("your-company-should-always-be-90-days-from-a-sale","nl")` starts with the shared header comment, contains `# Your Company Should Always Be 90 Days from a Sale`, the human URL, and the body text "A buyer calls"; `renderPostMarkdown("nope","en")` is `null`. Sitemap test: contains `${SITE_URL}/en/insights` and `${SITE_URL}/nl/insights`, contains the post's `/en` URL exactly once, does not contain its `/nl` URL, and the post entry has `lastModified`.
- [ ] **Step 2: Run** the affected test files. Expected: FAIL.
- [ ] **Step 3: Implement.** `mdInternalPathForPublic` also accepts `parsePostPath` matches. The `/m` route's `generateStaticParams` adds locales × post slugs; `GET` tries `parsePostPath` first and returns 404 when `renderPostMarkdown` is `null`. `llms.txt` gets an `## Insights` section listing each post's `/en` `.md` URL with its title. Sitemap adds the overview pages (with alternates, priority 0.7) and each post once at `postCanonical` with `lastModified: updated ?? date`, priority 0.6.
- [ ] **Step 4: Run** `npx vitest run`. Expected: PASS. Then `npm run build && npm run start` and `curl -s -H 'Accept: text/markdown' localhost:3000/en/insights/your-company-should-always-be-90-days-from-a-sale | head -5` shows Markdown; `curl -s -o /dev/null -w '%{http_code}' localhost:3000/en/insights/nope.md` prints `404`.
- [ ] **Step 5: Commit** `feat(insights): markdown negotiation, llms.txt and sitemap for posts`.

### Task 7: Docs and ship gate

**Files:**
- Modify: `CLAUDE.md`, `README.md`

- [ ] **Step 1: CLAUDE.md.** Replace "Contact form is front-end only..." with the real seams (`/api/contact`, `/api/newsletter`, `lib/brevo.ts`). Add an "Insights" bullet: posts are `content/insights/<slug>.md` with frontmatter `title`, `description` (≤ 160), `summary`, `date`, `author`, `lang`, optional `updated`, `draft`; publish = add file, run the gate, commit, push to `main` (Vercel project `cefabmanagement-com-2346` deploys). Note canonical-to-`/en`.
- [ ] **Step 2: README.md.** In the env/deploy section add the three new env vars and a "Brevo newsletter setup" list: create list, create DOI template (must contain the `{{ doubleoptin }}` link), set IDs in Vercel, check the API key has contacts permission. Add follow-ups to "Owner to-dos": privacy statement; delete unused Vercel project `cefabmanagement-com`.
- [ ] **Step 3: Ship gate.** `npm run test && npm run lint && npx tsc --noEmit && npm run build`. Expected: all pass; paste the summary lines.
- [ ] **Step 4: Commit** `docs: insights workflow, newsletter setup and env vars`.
