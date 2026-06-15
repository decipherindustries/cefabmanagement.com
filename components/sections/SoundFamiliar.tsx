import { Section } from "@/components/layout/Section";
import { SectionHead } from "@/components/layout/SectionHead";
import { CheckItem } from "@/components/ui/CheckItem";
import type { Dictionary } from "@/content";

export function SoundFamiliar({ dict }: { dict: Dictionary }) {
  return (
    <Section label={dict.problems.title}>
      <SectionHead title={dict.problems.title}>{dict.problems.subtitle}</SectionHead>
      <div className="ck-sf__grid">
        {dict.problems.items.map((t, i) => (
          <div className="ck-sf__cell" key={i}><CheckItem>{t}</CheckItem></div>
        ))}
      </div>
    </Section>
  );
}
