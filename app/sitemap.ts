import type { MetadataRoute } from "next";
import { LOCALES, PAGE_KEYS, href } from "@/lib/routes";
import { absolute } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const pageKey of PAGE_KEYS) {
    for (const locale of LOCALES) {
      entries.push({
        url: absolute(href(pageKey, locale)),
        changeFrequency: "monthly",
        priority: pageKey === "home" ? 1 : 0.8,
        alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, absolute(href(pageKey, l))])) },
      });
    }
  }
  return entries;
}
