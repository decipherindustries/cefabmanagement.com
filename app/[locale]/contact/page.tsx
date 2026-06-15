import type { Metadata } from "next";
import { Mail, Phone, Linkedin } from "lucide-react";
import { isLocale, type Locale } from "@/lib/routes";
import { getDictionary } from "@/content";
import { buildAlternates, canonicalFor } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { Section } from "@/components/layout/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale).meta.contact;
  return {
    title: d.title, description: d.description,
    alternates: { ...buildAlternates("contact"), canonical: canonicalFor("contact", locale) },
    openGraph: { title: d.title, description: d.description, url: canonicalFor("contact", locale), images: ["/portrait-catherine.png"] },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  return (
    <main>
      <div className="ck-hero-wrap">
        <Header locale={locale as Locale} nav={dict.nav} />
        <section className="ck-hero" aria-label={dict.contact.title}>
          <Container>
            <h1 className="ck-hero__title">{dict.contact.title}</h1>
            <p className="ck-hero__lead" style={{ marginTop: 16 }}>{dict.contact.subtitle}</p>
          </Container>
        </section>
      </div>
      <Section>
        <div className="ck-contact__body">
          <div className="ck-contact__info">
            <div className="ck-contact__row"><Mail /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
            <div className="ck-contact__row"><Phone /><a href={`tel:${SITE.phoneHref}`}>{SITE.phoneDisplay}</a></div>
            <div className="ck-contact__row"><Linkedin /><a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">{dict.about.linkedin}</a></div>
          </div>
          <ContactForm dict={dict} />
        </div>
      </Section>
    </main>
  );
}
