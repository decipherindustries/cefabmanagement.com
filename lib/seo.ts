import type { PostMeta } from "@/lib/insights";
import { LOCALES, href, postHref, type Locale, type PageKey } from "@/lib/routes";
import { SITE } from "@/lib/site";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cefabmanagement.com";

export function absolute(path: string): string {
  return `${SITE_URL}${path}`;
}

export function buildAlternates(pageKey: PageKey) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) languages[locale] = absolute(href(pageKey, locale));
  languages["x-default"] = absolute(href(pageKey, "en"));
  return { canonical: undefined as string | undefined, languages };
}

export function canonicalFor(pageKey: PageKey, locale: Locale): string {
  return absolute(href(pageKey, locale));
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: SITE.name,
        jobTitle: "Fractional CFO/COO",
        telephone: `+${SITE.phoneHref.replace(/^\+/, "")}`,
        url: SITE_URL,
        worksFor: { "@type": "Organization", name: SITE.legalName },
        sameAs: [SITE.linkedin],
      },
      {
        "@type": "ProfessionalService",
        name: SITE.legalName,
        description:
          "Hands-on fractional CFO/COO for ambitious scale-ups in the Netherlands and the UK.",
        telephone: `+${SITE.phoneHref.replace(/^\+/, "")}`,
        url: SITE_URL,
        areaServed: ["NL", "GB"],
        founder: { "@type": "Person", name: SITE.name },
      },
    ],
  };
}

/** Posts are written in English, so the /en URL is canonical for both locales. */
export function postCanonical(slug: string): string {
  return absolute(postHref(slug, "en"));
}

export function blogPostingJsonLd(post: PostMeta) {
  const url = postCanonical(post.slug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: post.lang,
        image: `${url}/opengraph-image`,
        author: { "@type": "Person", name: SITE.name, url: SITE_URL, sameAs: [SITE.linkedin] },
        publisher: { "@type": "Organization", name: SITE.legalName, url: SITE_URL },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Insights", item: absolute(href("insights", "en")) },
          { "@type": "ListItem", position: 2, name: post.title, item: url },
        ],
      },
    ],
  };
}
