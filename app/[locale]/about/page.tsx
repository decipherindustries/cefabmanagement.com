import type { Metadata } from "next";
import Image from "next/image";
import { isLocale, type Locale } from "@/lib/routes";
import { getDictionary } from "@/content";
import { buildAlternates, canonicalFor } from "@/lib/seo";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { AboutHero } from "@/components/sections/AboutHero";
import { StatStrip } from "@/components/sections/StatStrip";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { Connect } from "@/components/sections/Connect";
import { Linkedin } from "lucide-react";
import { SITE } from "@/lib/site";
import portrait from "@/public/portrait-catherine.png";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale).meta.about;
  return {
    title: d.title, description: d.description,
    alternates: { ...buildAlternates("about"), canonical: canonicalFor("about", locale) },
    openGraph: { title: d.title, description: d.description, url: canonicalFor("about", locale), images: ["/portrait-catherine.png"] },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  const paras = dict.about.bio.split("\n\n");
  return (
    <main>
      <AboutHero locale={locale as Locale} dict={dict} />
      <Section label={dict.about.title}>
        <div className="ck-about__body">
          <div className="ck-about__media">
            <Image src={portrait} alt="Catherine Cruickshank" sizes="(max-width: 980px) 90vw, 420px" placeholder="blur" />
          </div>
          <div className="ck-about__bio">
            {paras.map((p, i) => <p key={i}>{p}</p>)}
            <div className="ck-about__quotes">
              <span className="ck-about__quote">{dict.about.quote1}</span>
              <span className="ck-about__quote">{dict.about.quote2}</span>
            </div>
            <div className="ck-about__cta">
              <Button variant="primary" href={SITE.linkedin} target="_blank" rel="noopener noreferrer" iconRight={<Linkedin />}>{dict.about.linkedin}</Button>
              {SITE.cvUrl && <Button variant="outline" href={SITE.cvUrl}>{dict.about.cv}</Button>}
            </div>
          </div>
        </div>
        <StatStrip dict={dict} />
      </Section>
      <Connect locale={locale as Locale} dict={dict} />
      <LogoStrip dict={dict} />
    </main>
  );
}
