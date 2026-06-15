// Pure markdown renderers derived from the content dictionaries (single source
// of truth). NO React, NO next/* server-only imports - importable from a route
// handler / plain Node context.
import { getDictionary } from "@/content";
import { SITE } from "@/lib/site";
import { SITE_URL } from "@/lib/seo";
import { href, type Locale, type PageKey } from "@/lib/routes";

const OBFUSCATED_EMAIL = "catherine [at] cefabmanagement [dot] com";
const LINKEDIN = SITE.linkedin;

function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "nl" : "en";
}

function abs(pageKey: PageKey, locale: Locale): string {
  return `${SITE_URL}${href(pageKey, locale)}`;
}

/** Small header block shared by every markdown page. */
function header(pageKey: PageKey, locale: Locale): string {
  const htmlUrl = abs(pageKey, locale);
  const otherUrl = abs(pageKey, otherLocale(locale));
  return [
    `<!-- Markdown version for AI agents. Human version: ${htmlUrl} -->`,
    `> Markdown rendering of **${SITE.name} · CFO/COO** - ${locale.toUpperCase()}. Human page: ${htmlUrl}. Other language: ${otherUrl}.`,
  ].join("\n");
}

function connectSection(title: string, subtitle: string): string {
  const lines = [`## ${title}`, ""];
  if (subtitle) {
    lines.push(subtitle, "");
  }
  lines.push(`- **LinkedIn:** ${LINKEDIN}`, `- **Email:** ${OBFUSCATED_EMAIL}`);
  return lines.join("\n");
}

function renderHome(locale: Locale): string {
  const d = getDictionary(locale);
  const out: string[] = [];

  out.push(header("home", locale));
  out.push("");

  out.push(`# ${d.hero.title}`);
  out.push("");
  out.push(`*${d.hero.badge}*`);
  out.push("");
  out.push(d.hero.lead);
  out.push("");

  // Problems
  out.push(`## ${d.problems.title}`);
  out.push("");
  out.push(d.problems.subtitle);
  out.push("");
  for (const item of d.problems.items) out.push(`- ${item}`);
  out.push("");

  // Why
  out.push(`## ${d.why.title}`);
  out.push("");
  out.push(d.why.subtitle);
  out.push("");
  for (const card of d.why.cards) {
    out.push(`### ${card.title}`);
    out.push(card.body);
    out.push("");
  }

  // Services
  out.push(`## ${d.services.title}`);
  out.push("");
  out.push(d.services.subtitle);
  out.push("");
  for (const card of d.services.cards) {
    out.push(`### ${card.title}`);
    out.push(card.body);
    out.push("");
  }

  // Pricing
  out.push(`## ${d.pricing.title}`);
  out.push("");
  out.push(`${d.pricing.subtitlePrefix}${d.pricing.subtitleLink}${d.pricing.subtitleSuffix}`);
  out.push("");
  for (const tier of d.pricing.tiers) {
    const popular = tier.popular ? ` (${d.pricing.popularLabel})` : "";
    out.push(`### ${tier.name}${popular}`);
    out.push(tier.availability);
    out.push(tier.forWhom);
    out.push("");
    for (const feature of tier.features) out.push(`- ${feature}`);
    out.push("");
  }
  out.push(`**${d.pricing.project.name}**`);
  out.push("");
  for (const item of d.pricing.project.items) out.push(`- ${item}`);
  out.push("");
  out.push(d.pricing.project.note);
  out.push("");

  // FAQ
  out.push(`## ${d.faq.title}`);
  out.push("");
  for (const item of d.faq.items) {
    out.push(`### ${item.q}`);
    out.push(item.a);
    out.push("");
  }

  // Connect / get in touch
  out.push(connectSection(d.connect.title, d.connect.subtitle));

  return finalize(out);
}

function renderAbout(locale: Locale): string {
  const d = getDictionary(locale);
  const out: string[] = [];

  out.push(header("about", locale));
  out.push("");

  out.push(`# ${d.about.title}`);
  out.push("");
  out.push(d.about.intro);
  out.push("");
  out.push(d.about.bio);
  out.push("");

  out.push(`## Track record`);
  out.push("");
  for (const stat of d.about.stats) out.push(`- **${stat.value}** - ${stat.label}`);
  out.push("");

  out.push(`> ${d.about.testimonial.quote}`);
  out.push(">");
  out.push(`> ${d.about.testimonial.author}, ${d.about.testimonial.role}`);
  out.push("");

  out.push(connectSection("Connect", ""));

  return finalize(out);
}

function renderContact(locale: Locale): string {
  const d = getDictionary(locale);
  const htmlUrl = abs("contact", locale);
  const out: string[] = [];

  out.push(header("contact", locale));
  out.push("");

  out.push(`# ${d.contact.title}`);
  out.push("");
  out.push(d.contact.subtitle);
  out.push("");

  out.push(`## How to get in touch`);
  out.push("");
  out.push(`The best way to reach ${SITE.name} is via LinkedIn - send a message there:`);
  out.push("");
  out.push(`- **LinkedIn:** ${LINKEDIN}`);
  out.push("");
  out.push(`You can also email: **${OBFUSCATED_EMAIL}**`);
  out.push("");
  out.push(`(There is an interactive contact form on the human version of this page: ${htmlUrl}.)`);

  return finalize(out);
}

/** Trim trailing whitespace on each line; collapse to end with a single newline. */
function finalize(lines: string[]): string {
  const body = lines.map((l) => l.replace(/[ \t]+$/g, "")).join("\n");
  return body.replace(/\n+$/g, "") + "\n";
}

export function renderMarkdown(pageKey: PageKey, locale: Locale): string {
  switch (pageKey) {
    case "home":
      return renderHome(locale);
    case "about":
      return renderAbout(locale);
    case "contact":
      return renderContact(locale);
  }
}
