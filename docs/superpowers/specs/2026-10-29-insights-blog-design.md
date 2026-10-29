# Insights blog and newsletter sign-up - design

Date: 2026-10-29. Status: approved by Fabian in conversation.

## Intent

Give Catherine's site (cefabmanagement.com, fractional CFO/COO) a place to publish
articles, called **Insights**, so the LinkedIn writing also ranks in search and lives
on her own domain. Each article ends in a call to work with her and a newsletter
sign-up, so early readers can be collected for a future newsletter.

## Goals

- `/nl/insights` and `/en/insights` overview pages, and one page per article under both
  locales. Both locales list the **same** posts; posts are not translated (for now).
- Posts are Markdown files in the repo, rendered to HTML at build time (SSG, like every
  other page). No runtime fetching, no CMS.
- Markdown content negotiation for posts, matching the existing pages: `Accept:
  text/markdown` or a `.md` suffix returns the post's Markdown.
- SEO done properly (see below).
- Newsletter sign-up stored in Brevo with double opt-in, with a notification to
  directie@cefabmanagement.com.
- Contact form submissions go to directie@cefabmanagement.com (currently
  catherine@cefabmanagement.com via the code default in `lib/brevo.ts`).
- First post: "Your Company Should Always Be 90 Days from a Sale", approved by Catherine
  on 2026-10-29.

## Non-goals

- Translated posts, per-locale post lists, tags/categories, search, pagination,
  comments, RSS (RSS is cheap and may be added if trivial; not required).
- Sending newsletters. This build only collects addresses.
- A privacy statement (follow-up, see below).
- Any CMS, database or Supabase (the project forbids Supabase outright).

## Anti-goals

- Slower pages. Article pages must be static HTML with no client JS beyond what the
  site already ships plus the sign-up form.
- Two copies of the same article competing in Google. The `/nl` copy must point its
  canonical at the `/en` copy.
- Signing anyone up without their confirmation.

## Source of the first article

Vault file (outside the repo):
`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Fabian's Vault/Projects/CEFAB/CFO/LinkedIn Drafts/Your Company Should Always Be 90 Days from a Sale.md`

Copy only the article body: from the opening paragraph ("A buyer calls...") to the last
paragraph ("...before anyone asked."). Drop the vault frontmatter, the H1 (the page
renders the title), the callouts, the closing "*Interested in working with me?...*" line
(replaced by the end-of-article panel), the hashtags and the "For Catherine" notes.
Keep the text otherwise as written; it is approved copy. Publication date: 2026-10-29.
Fabian confirmed on 2026-10-29 that Catherine cleared the article for publication. The
vault note's mention of Merijn confirming the quote was a mistake; he is not involved.
It ships live, not as a draft.

## Decided (with Fabian)

- **Name:** "Insights" in both locales, slug `insights` in both.
- **Navigation:** "Insights" in the header and mobile menu between About and FAQ.
- **Overview page: plain list**, newest first. Per post: date, reading time, title
  (links to the post), the summary line, "Read →". No tags, no cards. A short intro line
  under the "Insights" heading, written per locale in the site's plain register. Ends
  with the newsletter sign-up panel.
- **Article page:** breadcrumb back to Insights, title (H1), meta line (Catherine
  Cruickshank · date · N min read), the body, then **one combined dark panel with two
  halves side by side**: left "Work with me" with a button to the contact page; right
  "New insights by email" with an email field, Subscribe button and "Unsubscribe any
  time". On phones the two halves stack. This replaces the closing "Interested in working
  with me?" line.
- The contact button links to the contact page; no inline contact form.
- The article stays in English on both `/nl` and `/en`. The page chrome (header, footer,
  panel, labels) follows the locale.
- **Double opt-in** in Brevo.
- Newsletter and contact notifications go to **directie@cefabmanagement.com**.

## Builder's calls (made by Claude, Fabian can override)

### Content and rendering
- Posts live in `content/insights/<slug>.md` with YAML frontmatter: `title`,
  `description` (meta description, ≤ 160 chars), `summary` (overview line), `date`
  (ISO), `author` (default Catherine Cruickshank), `lang` (`en` for now), optional
  `updated`, optional `draft: true` (excluded from production builds).
- The slug is the filename. First post:
  `your-company-should-always-be-90-days-from-a-sale`.
- Markdown parsed at build time with a small, well-maintained parser (e.g. `marked` or
  unified/remark). Posts are trusted repo content, but the pipeline should still not
  allow raw HTML injection beyond what Markdown produces. Reading time computed from
  word count (~220 wpm, rounded up).
- Rendered body styled with a `ck-prose` class in `app/styles/components.css` using the
  existing tokens (Instrument Serif headings, Karla body, ink colours). Readable measure
  (~68ch).
- Post UI strings (labels such as "Read", "min read", panel copy, intro line, meta
  titles for the overview) go in `content/en.ts` and `content/nl.ts`; dictionary parity
  tests must keep passing.

### Routing
- Add `insights` to `PageKey` in `lib/routes.ts` for the overview page. Post pages are
  `/[locale]/insights/[slug]`, generated with `generateStaticParams` over locales × posts.
- The existing proxy only rewrites known public pages; extend
  `mdInternalPathForPublic` / `resolvePublicPath` handling (or add a sibling helper) so
  post paths are recognised for the Markdown route, and the `/m/...` route serves post
  Markdown. Unknown slugs return 404.
- The Markdown response for a post is the post file's body with a short header (title,
  author, date, human URL), in the same style as `lib/markdown.ts`'s header.

### SEO
- Per-post `generateMetadata`: title `<post title> · Catherine Cruickshank`,
  description from frontmatter, canonical **always the `/en` URL** (the post's language),
  `hreflang` alternates only for the overview page (posts are one language, so no
  hreflang pair), OpenGraph `type: article` with `publishedTime`, `authors`, and image.
- `/nl` post pages: canonical to `/en`; still indexable is fine because the canonical
  consolidates them.
- `<html lang>` on post pages: the article body gets `lang="en"` on its container so
  the `/nl` page is correct even though the chrome is Dutch.
- JSON-LD `BlogPosting` (headline, description, datePublished, dateModified, author
  Person Catherine Cruickshank with LinkedIn `sameAs`, publisher CEFAB Management,
  mainEntityOfPage, image) plus `BreadcrumbList`.
- Generated OpenGraph image per post via Next's `opengraph-image` (ImageResponse) in
  the site's style: navy background, Instrument Serif title, "Catherine Cruickshank ·
  CFO/COO". Static at build time.
- Sitemap: add the overview page (both locales, with alternates) and each post once, at
  its canonical `/en` URL, with `lastModified`.
- `llms.txt`: add an "Insights" section listing posts' `.md` URLs.

### Newsletter sign-up
- Component `components/insights/NewsletterSignup.tsx` (client), used in the article
  panel and at the bottom of the overview page. Email field only, honeypot field, and
  reCAPTCHA v3 action `newsletter`, reusing `components/contact/recaptcha.ts`.
- API route `app/api/newsletter/route.ts`: validate email, honeypot, `verifyRecaptcha(
  token, "newsletter")`, then call Brevo's double opt-in endpoint
  (`POST https://api.brevo.com/v3/contacts/doubleOptinConfirmation`) with
  `includeListIds: [BREVO_NEWSLETTER_LIST_ID]`, `templateId:
  BREVO_DOI_TEMPLATE_ID`, `redirectionUrl` to a thank-you state on the site, and the
  locale as a contact attribute if available. An address that already exists must not
  produce an error the user sees; respond with the same success message.
- **Notification timing:** directie@ is emailed when someone **signs up** (subject makes
  clear confirmation is pending), using the existing transactional send in
  `lib/brevo.ts`. Notifying on confirmation would need a Brevo webhook into the site,
  which is more moving parts than this warrants. Confirmed by Fabian 2026-10-29.
- The redirect after confirmation lands on `/<locale>/insights?subscribed=1`, which shows
  a short confirmation message. This needs a tiny client component on an otherwise
  static page.
- New env vars, added to `.env.example` with no values: `BREVO_NEWSLETTER_LIST_ID`,
  `BREVO_DOI_TEMPLATE_ID`, `NEWSLETTER_NOTIFY_ADDRESS` (default
  directie@cefabmanagement.com). Real values set in the Vercel project
  `cefabmanagement-com-2346`, Production (and Preview if wanted).
- Rate-limit is not added in code; reCAPTCHA plus honeypot match the contact form.

### Contact form
- Change the default recipient in `lib/brevo.ts` from catherine@ to directie@ and
  update its test. `CONTACT_TO_ADDRESS` still overrides. Checked 2026-10-29 with
  `vercel env ls`: `CONTACT_TO_ADDRESS` is **not** set in Production on
  `cefabmanagement-com-2346`, so the code default is what production uses and this
  change is sufficient. (The local `.env` sets it to directie@; that only affects dev.)

## Manual setup Fabian (or Claude via the Vercel CLI) does

1. Brevo: create a contact list "Insights newsletter"; note its ID.
2. Brevo: create a double opt-in confirmation template (Brevo requires the
   `{{ doubleoptin }}` link placeholder); note its ID. Dutch or English copy, Fabian's
   choice; one template is enough.
3. Vercel (`cefabmanagement-com-2346`): add `BREVO_NEWSLETTER_LIST_ID` and
   `BREVO_DOI_TEMPLATE_ID`. Check that the existing `BREVO_API_KEY` has contact
   permissions, not only transactional email.
4. Until steps 1-3 are done, the sign-up route returns a generic error and logs why;
   the rest of the blog works.

## Constraints

- Follow the project's CLAUDE.md: Next 16 App Router, strict TS, Tailwind v4 plus the
  ported CSS in `app/styles/`, SSG everywhere, no Supabase, no em-dashes in copy,
  comments or docs, commit straight to `main`, no AI co-author trailers.
- Before shipping: `npm run test && npm run lint && npx tsc --noEmit && npm run build`.
- TDD for the logic (routing, post loading/frontmatter, Markdown route, sitemap,
  newsletter route, Brevo helpers).
- Copy in the plain business register (see global CLAUDE.md): no rhetoric, British
  spelling, sentence case.

## Follow-ups (not in this build)

- Privacy statement page, then link it from the sign-up panel and footer.
- Update the project CLAUDE.md, which still describes the contact form as "front-end
  only"; describe the Insights workflow ("add a file to `content/insights/`, push").
- Delete the unused Vercel project `cefabmanagement-com` (no domain, no env vars,
  still builds every push).
