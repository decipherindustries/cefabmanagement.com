// Single source of truth for brand contact + social details.
// Consumed by Footer, Contact/About pages, and the JSON-LD in lib/seo.ts.
export const SITE = {
  name: "Catherine Cruickshank",
  legalName: "CEFAB Management",
  email: "catherine@cefabmanagement.com",
  phoneDisplay: "+31 6 1135 7737",
  phoneHref: "+31611357737",
  linkedin: "https://www.linkedin.com/in/catherinecruickshank/",
  // No public CV: credentials live on LinkedIn (the current CV is a job-search
  // document with a personal email and off-brand framing). The About page hides
  // the CV button while this is null.
  cvUrl: null as string | null,
} as const;
