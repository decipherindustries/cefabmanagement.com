import type { MetadataRoute } from "next";
import { LOCALES, PAGE_KEYS, href } from "@/lib/routes";
import { absolute, postCanonical } from "@/lib/seo";
import { getAllPosts } from "@/lib/insights";

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
  for (const post of getAllPosts()) {
    entries.push({
      url: postCanonical(post.slug),
      lastModified: post.updated ?? post.date,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  return entries;
}
