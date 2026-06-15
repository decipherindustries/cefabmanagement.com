export interface Dictionary {
  nav: { home: string; about: string; contact: string };
  hero: { badge: string; title: string; lead: string; cta: string; cta2: string };
  problems: { title: string; subtitle: string; items: string[] }; // 12
  why: { title: string; subtitle: string; cards: { title: string; body: string }[] }; // 4
  services: { title: string; subtitle: string; cards: { title: string; body: string }[] }; // 4
  pricing: {
    title: string;
    popularLabel: string;
    subtitlePrefix: string; subtitleLink: string; subtitleSuffix: string;
    tiers: { name: string; popular?: boolean; availability: string; forWhom: string; features: string[] }[]; // 3
    project: { name: string; items: string[]; note: string };
  };
  faq: { title: string; items: { q: string; a: string }[] }; // 15
  about: {
    title: string; intro: string; bio: string; linkedin: string; cv: string;
    stats: { value: string; label: string }[]; // 4
    quote1: string; quote2: string;
  };
  contact: {
    title: string; subtitle: string;
    name: string; email: string; phone: string; company: string;
    interest: string; tiers: string[]; message: string; send: string; success: string;
  };
  footer: { tagline: string; rights: string; linksHeading: string; contactHeading: string };
  connect: { title: string; subtitle: string; cta: string };
  meta: {
    home: { title: string; description: string };
    about: { title: string; description: string };
    contact: { title: string; description: string };
  };
}
