import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { type Locale } from "@/lib/routes";
import type { Dictionary } from "@/content";

export function AboutHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <div className="ck-hero-wrap">
      <Header locale={locale} nav={dict.nav} />
      <section className="ck-hero" aria-label={dict.about.title}>
        <Container>
          <h1 className="ck-hero__title">{dict.about.title}</h1>
          <p className="ck-hero__lead" style={{ marginTop: 16 }}>{dict.about.intro}</p>
        </Container>
      </section>
    </div>
  );
}
