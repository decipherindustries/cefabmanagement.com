import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { formatPostDate, getAllPosts, getPost, readingMinutes } from "./insights";

const FIX = path.join(__dirname, "__fixtures__/insights");

afterEach(() => vi.unstubAllEnvs());

describe("getAllPosts", () => {
  it("returns posts newest first with a reading time", () => {
    const posts = getAllPosts(FIX);
    const slugs = posts.map((p) => p.slug);
    expect(slugs.slice(0, 2)).toEqual(["b", "a"]);
    expect(posts.every((p) => p.readingMinutes >= 1)).toBe(true);
  });

  it("excludes drafts in production", () => {
    expect(getAllPosts(FIX).map((p) => p.slug)).toContain("draft");
    vi.stubEnv("NODE_ENV", "production");
    expect(getAllPosts(FIX).map((p) => p.slug)).not.toContain("draft");
    expect(getPost("draft", FIX)).toBeNull();
  });
});

describe("getPost", () => {
  it("defaults the author to Catherine Cruickshank", () => {
    expect(getPost("noauthor", FIX)?.author).toBe("Catherine Cruickshank");
  });

  it("returns null for unknown or unsafe slugs", () => {
    expect(getPost("nope", FIX)).toBeNull();
    expect(getPost("../package", FIX)).toBeNull();
  });

  it("escapes raw HTML", () => {
    const { html } = getPost("html", FIX)!;
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("strips frontmatter from the markdown", () => {
    expect(getPost("a", FIX)!.markdown.startsWith("---")).toBe(false);
  });

  it("loads the first real post", () => {
    const post = getPost("your-company-should-always-be-90-days-from-a-sale")!;
    expect(post.title).toBe("Your Company Should Always Be 90 Days from a Sale");
    expect(post.date).toBe("2026-10-29");
    expect(post.lang).toBe("en");
    expect(post.description.length).toBeLessThanOrEqual(160);
  });
});

describe("readingMinutes", () => {
  it("rounds up at 220 words per minute, minimum 1", () => {
    expect(readingMinutes("word ".repeat(221))).toBe(2);
    expect(readingMinutes("")).toBe(1);
  });
});

describe("formatPostDate", () => {
  it("formats per locale", () => {
    expect(formatPostDate("2026-10-29", "en")).toBe("29 October 2026");
    expect(formatPostDate("2026-10-29", "nl")).toBe("29 oktober 2026");
  });
});
