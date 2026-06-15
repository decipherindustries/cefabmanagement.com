import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/routes";
import { getDictionary } from "@/content";
import { buildAlternates, canonicalFor } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
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
      {/* SoundFamiliar / WhyWorkTogether / WhatIDo / Packages / Faq inserted in Tasks 17–21 */}
      <Connect locale={locale as Locale} dict={dict} />
    </main>
  );
}
