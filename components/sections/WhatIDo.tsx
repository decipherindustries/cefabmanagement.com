import { TrendingUp, Target, Users, BadgeCheck } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHead } from "@/components/layout/SectionHead";
import { FeatureCard } from "@/components/ui/FeatureCard";
import type { Dictionary } from "@/content";

const ICONS = [<TrendingUp key="t" />, <Target key="g" />, <Users key="u" />, <BadgeCheck key="b" />];

export function WhatIDo({ dict }: { dict: Dictionary }) {
  return (
    <Section band label={dict.services.title}>
      <SectionHead title={dict.services.title}>{dict.services.subtitle}</SectionHead>
      <div className="ck-grid4">
        {dict.services.cards.map((c, i) => (
          <FeatureCard key={c.title} iconVariant="plain" icon={ICONS[i]} title={c.title}>
            {c.body}
          </FeatureCard>
        ))}
      </div>
    </Section>
  );
}
