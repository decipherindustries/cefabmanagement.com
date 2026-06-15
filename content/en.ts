import type { Dictionary } from "./types";

export const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About Me",
    contact: "Contact",
  },
  hero: {
    badge: "Fractional CFO/COO",
    title: "Business partner for scale-ups ready for the next phase",
    lead: "I help ambitious entrepreneurs (€3-25M revenue) who know what they're doing but are hitting the limits of their systems. Not with reports and advice, but by hands-on building the finance, operations and processes needed to grow 5-10x (or more).",
    cta: "Schedule a call",
    cta2: "Learn more",
  },
  problems: {
    title: "Sound familiar?",
    subtitle:
      "Your business is growing, but you're noticing your financial and operational systems aren't scaling anymore",
    items: [
      "The numbers are right, but they don't help with decisions",
      "You know your revenue, but not your profit at deal level",
      "Cashflow or sales feels more stressful than necessary - despite the growth",
      "Your cashflow dashboard is an Excel sheet only you understand",
      "You have to assess whether a new hire is profitable - nobody can give you an answer",
      "Systems and processes require too much manual work and attention",
      "Too many operational decisions keep falling on the entrepreneur",
      "Investors or potential buyers ask for data you can't deliver within 24 hours",
      "A full-time CFO/COO feels too heavy, too early, or too limiting",
      "You make strategic choices based on gut feeling instead of data",
      "Numbers are in different systems that don't align properly",
      "It's difficult to involve the management team in numbers and give budget responsibility",
    ],
  },
  why: {
    title: "Why work together?",
    subtitle:
      "An experienced business partner who thinks along, takes work off your hands, and works within your existing organization",
    cards: [
      {
        title: "Operator, not advisor",
        body: "No reports on a shelf - we build and implement together. Roll up sleeves, in your systems, with your team.",
      },
      {
        title: "Pragmatic, not academic",
        body: "We don't touch what works. Focus on quick wins and the long term. No frameworks for frameworks - just do what's needed, with clear outcomes.",
      },
      {
        title: "Proven track record",
        body: "10+ years CFO/COO in scale-ups (€5-100M, up to 150 FTE). M&A, funding rounds, exits up to €80M, operational turnarounds — I've seen this movie before, including the next phase.",
      },
      {
        title: "CFO + COO Combination",
        body: "Finance and operations - so not just focus on numbers but also on people, systems and processes.",
      },
    ],
  },
  services: {
    title: "What I do",
    subtitle:
      "Hands-on support at the intersection of finance and operations",
    cards: [
      {
        title: "Financial Management",
        body: "Budgeting, forecasting, cashflow management, KPI dashboards, and financial reporting that helps with decisions",
      },
      {
        title: "Operational Excellence",
        body: "Process optimization, system implementations, team structuring, and setting up scalable operations",
      },
      {
        title: "Strategic Planning",
        body: "Scenario planning, business cases, investment evaluations, and strategic decision support",
      },
      {
        title: "Due Diligence Ready",
        body: "Preparation for exit, investment, acquisition or loan. Setting up data room, financial models, and becoming investor ready",
      },
    ],
  },
  pricing: {
    title: "Packages",
    popularLabel: "Popular",
    subtitlePrefix: "",
    subtitleLink: "Contact",
    subtitleSuffix: " us for more information",
    tiers: [
      {
        name: "Foundation",
        availability: "~2 days per month availability (flexible to schedule)",
        forWhom: "For whom: You have basics in place, want structure and insight",
        features: [
          "Setting up financial dashboards & KPI's",
          "Basic FP&A (budget, forecast, actuals)",
          "Monthly business review",
          "Ad-hoc sparring (max 4 hours/month)",
        ],
      },
      {
        name: "Growth",
        popular: true,
        availability: "~4-5 days per month availability (flexible to schedule)",
        forWhom: "For whom: Active growth phase, multiple workstreams simultaneously",
        features: [
          "Everything in Foundation, plus:",
          "Advanced scenario modeling",
          "System optimization (process improvement)",
          "Team coaching (controller/finance)",
          "Board reporting & investor relations",
          "Weekly strategic sessions",
        ],
      },
      {
        name: "Strategic",
        availability: "~8-10 days per month availability (flexible to schedule)",
        forWhom: "For whom: Complex transformation, M&A, exit prep",
        features: [
          "Everything in Growth, plus:",
          "Full CFO/COO responsibility",
          "Support with (international) expansion",
          "M&A deal support (buy-side/sell-side)",
          "Support with funding (equity or debt-based)",
          "Direct leadership of finance/ops team",
          "Participation in board/MT meetings",
        ],
      },
    ],
    project: {
      name: "Project Based - Fixed Price",
      items: [
        "Exit/follow-up preparation",
        "Funding round",
        "M&A deal support",
        "System overhaul",
        "Custom: on request",
      ],
      note: "Price depends on scope, complexity, and duration. Always clear commitment on outcomes and deliverables upfront.",
    },
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "How quickly can you start?",
        a: "Typically within 1-2 weeks after intake. We start with a thorough assessment (1-2 days) to get priorities clear, and build momentum quickly. For urgent situations (e.g., acute funding round), I can accelerate.",
      },
      {
        q: "Do you work remotely or on-site?",
        a: "Flexible. Typically: 1 day per week/month on-site (depending on tier) + remote availability. For critical phases (e.g., M&A due diligence), I can be present for multiple days. Location: primarily NL/Belgium, selectively DACH region.",
      },
      {
        q: "How long does an average partnership last?",
        a: "Fractional partnerships often last 12-24+ months - long enough to achieve real transformation. Project-based work is typically 2-6 months. Some clients scale up to full-time CFO after a year (where I help with selection), others stay with fractional because it fits perfectly.",
      },
      {
        q: "What happens if we need more (or less) capacity?",
        a: "We evaluate every 3-6 months if the tier still fits. Scaling up or down can be done with a 1-month notice period. For temporary spikes (e.g., funding round), we can also add project-based support on top of your retainer.",
      },
      {
        q: "Which systems/tools do you work with?",
        a: "I am tool-agnostic and work with what you already have. Previous experiences include: Accounting: Exact Online, Exact Globe, Twinfield, AFAS, Odoo | ERP: Exact Globe, AFAS, Odoo | FP&A: Excel/Google Sheets, Anaplan, Adaptive Insights | BI: Power BI, Tableau, SQL-based tools | CRM: Salesforce, HubSpot, Pipedrive. And if your systems don't work, I help with selection & implementation.",
      },
      {
        q: "What does a typical first month look like?",
        a: "Week 1-2: Deep dive assessment (finance, operations, systems, team) | Week 3: Priorities & roadmap determination together with you | Week 4: Implement quick wins + start structural improvements | From month 2: On schedule according to agreed tier (weekly/monthly).",
      },
      {
        q: "Do you work alone or with a team?",
        a: "Primarily, I work independently within your organization. For specialized issues (e.g., international tax structure, complex M&A), I work with a network of experts. This prevents you from having to build your own team for everything.",
      },
      {
        q: "Who is this NOT suitable for?",
        a: "This partnership does not work if: You are under €2-3M revenue (too early - focus first on product-market fit) | You only need someone to keep the administration running (hire an accountant) | You expect me to 'fix' it without your involvement (partnership works two-way) | Your next step is a private equity deal where you are no longer operationally involved.",
      },
      {
        q: "How do we determine if we are a good match?",
        a: "We always start with a free introductory call (30-60 min). If we both think it can work: a thorough intake/assessment (half day, at cost). Then we both know for sure if the chemistry is right and if I can add real value.",
      },
      {
        q: "With which sectors/industries do you have experience?",
        a: "Primarily technology (SaaS and hardware), cleantech/EV, telecom. But the beauty of CFO/COO work is that many issues (cashflow, scaling, M&A) are universal. If your sector requires specific expertise (e.g., complex regulatory), I check if I am the right person or bring in specialists.",
      },
      {
        q: "How do you measure success?",
        a: "We set KPIs together at the start. For example: Financial: cash runway improvement, margin improvement, forecast accuracy | Operational: time-to-close financials, process efficiency, team capability, clarity/structure within the company | Strategic: funding secured, deal closed, exit valuation. We review these quarterly and tweak where necessary.",
      },
      {
        q: "What is the ROI of a fractional CFO/COO?",
        a: "Direct ROI you see in: Better deals (5-15% better M&A or funding terms = €100k+ for a €5M deal) | Margin improvements (2-5% = €100-250k for a €5M revenue) | Preventing costly mistakes (1 bad hire costs €50-100k) | Freeing up your time (20+ hours/month = you focus on sales/strategy). Indirect ROI: faster growth through better decisions, avoiding cashflow problems, higher exit valuation through professionalism.",
      },
      {
        q: "How does this work contractually?",
        a: "Fractional: mutually agreeable retainer contract (ovv). Project-based: fixed amount, clear scope, deliverables & timeline. No payroll hassle - I invoice through my BV.",
      },
      {
        q: "Are you also available as interim or permanent CFO/COO?",
        a: "My focus is fractional CFO/COO partnerships. Additionally, I do selective interim work (e.g., during transition phases or for exit preparation) if it fits my expertise, the client, and there is a good interpersonal and business fit. Regarding a permanent position - I never say never; but it is not my focus at this moment. A successful founder/CEO + CFO partnership in a scale-up only works if the personalities, egos, and ambitions fully align.",
      },
      {
        q: "Do you get equity/shares?",
        a: "Normally not - I work on market-conform fees. For specific situations (e.g., pre-funding startup where cash is scarce, special strategic partnership, or the partnership evolves into a permanent position) a hybrid model (fee + limited equity) can be discussed. This is case-by-case customization.",
      },
    ],
  },
  about: {
    title: "About Catherine",
    intro: "10+ years experience as CFO and COO in fast-growing scale-ups",
    bio: "Catherine Cruickshank has over a decade of experience building and optimizing finance and operations in scale-ups from €5M to €100M revenue. She has guided companies through funding rounds, M&A processes, and exits up to €80M, and knows from experience what it takes to grow from small to large.\n\nShe combines strategic insight with a practical, hands-on approach. No reports that end up on a shelf, but concrete implementations that have direct impact on the organization.",
    linkedin: "View LinkedIn profile",
    cv: "Download CV",
    stats: [
      { value: "10+", label: "Years executive management experience" },
      { value: "€5–100M", label: "Revenue range" },
      { value: "€80M", label: "Largest exit" },
      { value: "10–150", label: "FTE managed" },
    ],
    quote1: "Outside of work, I love traveling to sunny destinations and skiing.",
    quote2: "I have experience in the Netherlands, Germany, and England.",
  },
  contact: {
    title: "Let's connect",
    subtitle:
      "Want to know if we're a good match? Schedule a non-committal conversation or send a message.",
    name: "Name",
    email: "Email",
    phone: "Phone number",
    company: "Company",
    interest: "Interest in (optional)",
    tiers: ["Foundation", "Growth", "Strategic", "Project-based"],
    message: "Message",
    send: "Send",
    success: "Thank you for your message! I'll get back to you soon.",
  },
  footer: {
    tagline: "Fractional CFO/COO for scale-ups ready for the next phase",
    rights: "All rights reserved",
    linksHeading: "Links",
    contactHeading: "Contact",
  },
  connect: {
    title: "Let's connect",
    subtitle:
      "Want to know if we're a good match? Schedule a non-committal conversation or send a message.",
    cta: "Schedule a call",
  },
  meta: {
    home: {
      title: "Catherine Cruickshank · Fractional CFO/COO for scale-ups",
      description:
        "Hands-on fractional CFO/COO for €3-25M scale-ups. I build the finance, operations and systems you need to grow 5-10x — operator, not advisor.",
    },
    about: {
      title: "About Catherine Cruickshank · CFO/COO",
      description:
        "10+ years building finance and operations in scale-ups — M&A, funding rounds and exits up to €80M. Meet the operator behind CEFAB Management.",
    },
    contact: {
      title: "Contact · Catherine Cruickshank CFO/COO",
      description:
        "Want to know if we're a good match? Schedule a non-committal conversation or send a message.",
    },
  },
};
