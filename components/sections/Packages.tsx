import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SectionHead } from "@/components/layout/SectionHead";
import { PricingCard } from "@/components/ui/PricingCard";
import { CheckItem } from "@/components/ui/CheckItem";
import { href, type Locale } from "@/lib/routes";
import type { Dictionary } from "@/content";

export function Packages({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const p = dict.pricing;
  return (
    <Section label={p.title}>
      <SectionHead title={p.title}>{p.intro}</SectionHead>
      <div className="ck-pricing">
        {p.tiers.map((t) => <PricingCard key={t.name} {...t} popularLabel={p.popularLabel} />)}
      </div>
      <p className="ck-pricing__note">
        {p.subtitlePrefix}
        <Link className="ck-link" href={href("contact", locale)}>{p.subtitleLink}</Link>
        {p.subtitleSuffix}
      </p>
      <div className="ck-project">
        <h3 className="ck-project__title">{p.project.name}</h3>
        <div className="ck-project__grid">
          {p.project.items.map((it) => <CheckItem key={it}>{it}</CheckItem>)}
        </div>
        <p className="ck-project__note">{p.project.note}</p>
      </div>
    </Section>
  );
}
