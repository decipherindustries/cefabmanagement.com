import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/routes";
import { getDictionary } from "@/content";
import { buildAlternates, canonicalFor } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { SoundFamiliar } from "@/components/sections/SoundFamiliar";
import { WhyWorkTogether } from "@/components/sections/WhyWorkTogether";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { Packages } from "@/components/sections/Packages";
import { Faq } from "@/components/sections/Faq";
import { Connect } from "@/components/sections/Connect";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale).meta.home;
  return {
    title: d.title,
    description: d.description,
    alternates: { ...buildAlternates("home"), canonical: canonicalFor("home", locale) },
    openGraph: { title: d.title, description: d.description, url: canonicalFor("home", locale), images: ["/portrait-catherine.png"] },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  return (
    <main>
      <Hero locale={locale as Locale} dict={dict} />
      <SoundFamiliar dict={dict} />
      <LogoStrip dict={dict} />
      <WhyWorkTogether dict={dict} />
      <WhatIDo dict={dict} />
      <Packages locale={locale as Locale} dict={dict} />
      <Faq dict={dict} />
      <Connect locale={locale as Locale} dict={dict} />
    </main>
  );
}
