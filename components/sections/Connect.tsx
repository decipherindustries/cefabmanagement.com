import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { href, type Locale } from "@/lib/routes";
import type { Dictionary } from "@/content";

export function Connect({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="ck-connect" aria-label={dict.connect.title}>
      <Container className="ck-connect__inner">
        <h2 className="ck-connect__title">{dict.connect.title}</h2>
        <p className="ck-connect__sub">{dict.connect.subtitle}</p>
        <Button variant="inverse" size="lg" href={href("contact", locale)} iconRight={<ArrowRight />}>
          {dict.connect.cta}
        </Button>
      </Container>
    </section>
  );
}
