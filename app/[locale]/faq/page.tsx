import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/routes";
import { getDictionary } from "@/content";
import { buildAlternates, canonicalFor, faqJsonLd } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { Section } from "@/components/layout/Section";
import { FAQItem } from "@/components/ui/FAQItem";
import { Connect } from "@/components/sections/Connect";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale).meta.faq;
  return {
    title: d.title, description: d.description,
    alternates: { ...buildAlternates("faq"), canonical: canonicalFor("faq", locale) },
    openGraph: { title: d.title, description: d.description, url: canonicalFor("faq", locale), images: ["/portrait-catherine.png"] },
  };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(dict.faq.items)) }}
      />
      <div className="ck-hero-wrap">
        <Header locale={locale as Locale} nav={dict.nav} />
        <section className="ck-hero" aria-label={dict.faq.title}>
          <Container>
            <h1 className="ck-hero__title">{dict.faq.title}</h1>
            <p className="ck-hero__lead" style={{ marginTop: 16 }}>{dict.faq.subtitle}</p>
          </Container>
        </section>
      </div>
      <Section label={dict.faq.title}>
        <div className="ck-faq">
          {dict.faq.items.map((f, i) => (
            <FAQItem key={f.q} question={f.q} defaultOpen={i === 0}>{f.a}</FAQItem>
          ))}
        </div>
      </Section>
      <Connect locale={locale as Locale} dict={dict} />
    </main>
  );
}
