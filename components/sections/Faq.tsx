import { Section } from "@/components/layout/Section";
import { SectionHead } from "@/components/layout/SectionHead";
import { FAQItem } from "@/components/ui/FAQItem";
import type { Dictionary } from "@/content";

export function Faq({ dict }: { dict: Dictionary }) {
  return (
    <Section label={dict.faq.title}>
      <SectionHead title={dict.faq.title} />
      <div className="ck-faq">
        {dict.faq.items.map((f, i) => (
          <FAQItem key={f.q} question={f.q} defaultOpen={i === 0}>{f.a}</FAQItem>
        ))}
      </div>
    </Section>
  );
}
