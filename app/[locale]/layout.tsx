import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { LOCALES, isLocale, type Locale } from "@/lib/routes";
import { getDictionary } from "@/content";
import { Footer } from "@/components/layout/Footer";
import { HtmlLang } from "@/components/util/HtmlLang";
import { personJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children, params,
}: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);
  const year = 2026; // build-time constant; bump on yearly rebuilds

  return (
    <>
      <HtmlLang locale={locale as Locale} />
      <meta httpEquiv="content-language" content={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      {children}
      <Footer locale={locale as Locale} dict={dict} year={year} />
    </>
  );
}
