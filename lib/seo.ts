import { LOCALES, href, type Locale, type PageKey } from "@/lib/routes";
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
          "Hands-on fractional CFO/COO for ambitious scale-ups in the Netherlands, Germany and the UK.",
        telephone: `+${SITE.phoneHref.replace(/^\+/, "")}`,
        url: SITE_URL,
        areaServed: ["NL", "DE", "GB"],
        founder: { "@type": "Person", name: SITE.name },
      },
    ],
  };
}
