import { LOCALES, href, type Locale, type PageKey } from "@/lib/routes";

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
        name: "Catherine Cruickshank",
        jobTitle: "Fractional CFO/COO",
        email: "mailto:catherine@cefabmanagement.com",
        telephone: "+31611357737",
        url: SITE_URL,
        worksFor: { "@type": "Organization", name: "CEFAB Management" },
        // sameAs: ["<LinkedIn URL — TODO owner to provide>"],
      },
      {
        "@type": "ProfessionalService",
        name: "CEFAB Management",
        description:
          "Hands-on fractional CFO/COO for €3-25M scale-ups in the Netherlands, Germany and the UK.",
        email: "mailto:catherine@cefabmanagement.com",
        telephone: "+31611357737",
        url: SITE_URL,
        areaServed: ["NL", "DE", "GB"],
        founder: { "@type": "Person", name: "Catherine Cruickshank" },
      },
    ],
  };
}
