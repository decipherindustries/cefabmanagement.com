import { Zap, Target, Award, Users } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHead } from "@/components/layout/SectionHead";
import { FeatureCard } from "@/components/ui/FeatureCard";
import type { Dictionary } from "@/content";

const ICONS = [<Zap key="z" />, <Target key="t" />, <Award key="a" />, <Users key="u" />];

export function WhyWorkTogether({ dict }: { dict: Dictionary }) {
  return (
    <Section label={dict.why.title}>
      <SectionHead title={dict.why.title}>{dict.why.subtitle}</SectionHead>
      <div className="ck-grid2">
        {dict.why.cards.map((c, i) => (
          <FeatureCard key={c.title} variant="soft" iconVariant="dark" icon={ICONS[i]} title={c.title}>
            {c.body}
          </FeatureCard>
        ))}
      </div>
    </Section>
  );
}
