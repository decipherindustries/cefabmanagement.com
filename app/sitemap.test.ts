import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists all 6 localised URLs", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://cefabmanagement.com/en");
    expect(urls).toContain("https://cefabmanagement.com/nl");
    expect(urls).toContain("https://cefabmanagement.com/en/about");
    expect(urls).toContain("https://cefabmanagement.com/nl/over-mij");
    expect(urls).toContain("https://cefabmanagement.com/en/contact");
    expect(urls).toContain("https://cefabmanagement.com/nl/contact");
    expect(urls).toHaveLength(6);
  });
});
