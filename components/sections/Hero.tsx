import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { href, type Locale } from "@/lib/routes";
import type { Dictionary } from "@/content";
import portrait from "@/public/portrait-catherine.png";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <div className="ck-hero-wrap">
      <Header locale={locale} nav={dict.nav} />
      <section className="ck-hero" aria-label="Hero">
        <Container className="ck-hero__grid">
          <div className="ck-hero__copy">
            <Badge variant="subtle">{dict.hero.badge}</Badge>
            <h1 className="ck-hero__title">{dict.hero.title}</h1>
            <p className="ck-hero__lead">{dict.hero.lead}</p>
            <div className="ck-hero__cta">
              <Button variant="inverse" size="lg" href={href("contact", locale)} iconRight={<ArrowRight />}>
                {dict.hero.cta}
              </Button>
              <Button variant="secondary" size="lg" href={href("about", locale)}>
                {dict.hero.cta2}
              </Button>
            </div>
          </div>
          <div className="ck-hero__media">
            <Image src={portrait} alt="Catherine Cruickshank" priority fetchPriority="high" placeholder="blur" sizes="(max-width: 980px) 90vw, 460px" />
          </div>
        </Container>
      </section>
    </div>
  );
}
