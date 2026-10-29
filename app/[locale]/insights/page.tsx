import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, postHref, type Locale } from "@/lib/routes";
import { getDictionary } from "@/content";
import { formatPostDate, getAllPosts } from "@/lib/insights";
import { buildAlternates, canonicalFor } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { Section } from "@/components/layout/Section";
import { NewsletterSignup } from "@/components/insights/NewsletterSignup";
import { SubscribedNotice } from "@/components/insights/SubscribedNotice";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale).meta.insights;
  return {
    title: d.title, description: d.description,
    alternates: { ...buildAlternates("insights"), canonical: canonicalFor("insights", locale) },
    openGraph: { title: d.title, description: d.description, url: canonicalFor("insights", locale), images: ["/portrait-catherine.png"] },
  };
}

export default async function InsightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  const t = dict.insights;
  const posts = getAllPosts();
  return (
    <main>
      <div className="ck-hero-wrap">
        <Header locale={locale as Locale} nav={dict.nav} />
        <section className="ck-hero" aria-label={t.title}>
          <Container>
            <h1 className="ck-hero__title">{t.title}</h1>
            <p className="ck-hero__lead" style={{ marginTop: 16 }}>{t.intro}</p>
          </Container>
        </section>
      </div>
      <Section label={t.title}>
        <SubscribedNotice message={t.subscribed} />
        <ul className="ck-post-list">
          {posts.map((p) => (
            <li key={p.slug} className="ck-post-list__item">
              <p className="ck-post-meta">
                {formatPostDate(p.date, locale as Locale)} · {p.readingMinutes} {t.minRead}
              </p>
              <h2 className="ck-post-list__title">
                <Link href={postHref(p.slug, locale as Locale)}>{p.title}</Link>
              </h2>
              <p className="ck-post-list__summary">{p.summary}</p>
              <Link className="ck-post-list__read" href={postHref(p.slug, locale as Locale)} aria-label={`${t.read}: ${p.title}`}>
                {t.read} →
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <section className="ck-insights-signup" aria-label={t.newsletter.title}>
        <Container>
          <NewsletterSignup dict={dict} locale={locale as Locale} tone="dark" />
        </Container>
      </section>
    </main>
  );
}
