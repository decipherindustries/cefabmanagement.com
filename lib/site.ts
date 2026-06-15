// Single source of truth for brand contact + social details.
// Consumed by Footer, Contact/About pages, and the JSON-LD in lib/seo.ts.
export const SITE = {
  name: "Catherine Cruickshank",
  legalName: "CEFAB Management",
  email: "catherine@cefabmanagement.com",
  phoneDisplay: "+31 6 1135 7737",
  phoneHref: "+31611357737",
  linkedin: "https://www.linkedin.com/in/catherinecruickshank/",
  cvUrl: "/cv-catherine-cruickshank.pdf" as string | null,
} as const;
