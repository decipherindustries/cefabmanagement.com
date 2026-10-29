import { describe, it, expect } from "vitest";
import { SITE } from "@/lib/site";
import type { PostMeta } from "@/lib/insights";
import { SITE_URL, blogPostingJsonLd, buildAlternates, personJsonLd, postCanonical } from "./seo";

const meta: PostMeta = {
  slug: "x",
  title: "A title",
  description: "A description",
  summary: "A summary",
  date: "2026-10-29",
  author: "Catherine Cruickshank",
  lang: "en",
  readingMinutes: 3,
};

type Node = Record<string, unknown> & { "@type": string };
const node = (type: string) =>
  (blogPostingJsonLd(meta) as { "@graph": Node[] })["@graph"].find((n) => n["@type"] === type)!;

describe("seo", () => {
  it("builds hreflang alternates with localised URLs + x-default", () => {
    const alt = buildAlternates("about");
    expect(alt.languages.en).toBe("https://cefabmanagement.com/en/about");
    expect(alt.languages.nl).toBe("https://cefabmanagement.com/nl/over-mij");
    expect(alt.languages["x-default"]).toBe("https://cefabmanagement.com/en/about");
  });
  it("emits Person + ProfessionalService JSON-LD", () => {
    const ld = personJsonLd();
    const types = ld["@graph"].map((n: { "@type": string }) => n["@type"]);
    expect(types).toContain("Person");
    expect(types).toContain("ProfessionalService");
  });
  it("uses the /en URL as the post canonical", () => {
    expect(postCanonical("x")).toBe(`${SITE_URL}/en/insights/x`);
  });
  it("emits a BlogPosting node", () => {
    const post = node("BlogPosting");
    expect(post.headline).toBe("A title");
    expect(post.description).toBe("A description");
    expect(post.datePublished).toBe("2026-10-29");
    expect(post.dateModified).toBe("2026-10-29");
    expect(post.inLanguage).toBe("en");
    expect(post.mainEntityOfPage).toBe(postCanonical("x"));
    const author = post.author as { name: string; sameAs: string[] };
    expect(author.name).toBe("Catherine Cruickshank");
    expect(author.sameAs).toContain(SITE.linkedin);
    expect((post.publisher as { name: string }).name).toBe("CEFAB Management");
  });
  it("uses updated as dateModified when set", () => {
    const ld = blogPostingJsonLd({ ...meta, updated: "2026-11-02" }) as { "@graph": Node[] };
    expect(ld["@graph"].find((n) => n["@type"] === "BlogPosting")!.dateModified).toBe("2026-11-02");
  });
  it("emits a BreadcrumbList from Insights to the post", () => {
    const items = node("BreadcrumbList").itemListElement as { position: number; name: string; item: string }[];
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ position: 1, name: "Insights", item: `${SITE_URL}/en/insights` });
    expect(items[1]).toMatchObject({ position: 2, name: "A title", item: postCanonical("x") });
  });
});
