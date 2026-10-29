import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { getAllPosts } from "@/lib/insights";
import { PAGE_KEYS, LOCALES } from "@/lib/routes";

const SITE = "https://cefabmanagement.com";

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);
  const posts = getAllPosts();

  it("lists the localised page URLs", () => {
    for (const u of [
      "/en", "/nl", "/en/about", "/nl/over-mij", "/en/contact", "/nl/contact",
      "/en/faq", "/nl/faq", "/en/insights", "/nl/insights",
    ]) {
      expect(urls).toContain(SITE + u);
    }
  });

  it("lists each post once at its /en URL and not at /nl", () => {
    expect(posts.length).toBeGreaterThan(0);
    for (const p of posts) {
      expect(urls.filter((u) => u === `${SITE}/en/insights/${p.slug}`)).toHaveLength(1);
      expect(urls).not.toContain(`${SITE}/nl/insights/${p.slug}`);
      const entry = entries.find((e) => e.url === `${SITE}/en/insights/${p.slug}`)!;
      expect(entry.lastModified).toBe(p.updated ?? p.date);
      expect(entry.priority).toBe(0.6);
    }
  });

  it("has one entry per page per locale plus one per post", () => {
    expect(entries).toHaveLength(PAGE_KEYS.length * LOCALES.length + posts.length);
  });
});
