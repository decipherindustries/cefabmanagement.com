import { describe, it, expect } from "vitest";
import { renderMarkdown, renderPostMarkdown } from "./markdown";

const SLUG = "your-company-should-always-be-90-days-from-a-sale";

describe("renderPostMarkdown", () => {
  it("renders header, title, human URL and body", () => {
    const md = renderPostMarkdown(SLUG, "nl")!;
    expect(md.startsWith("<!-- Markdown version for AI agents.")).toBe(true);
    expect(md).toContain("# Your Company Should Always Be 90 Days from a Sale");
    expect(md).toContain(`https://cefabmanagement.com/nl/insights/${SLUG}`);
    expect(md).toContain("A buyer calls");
    expect(md.endsWith("\n")).toBe(true);
  });
  it("returns null for an unknown slug", () => {
    expect(renderPostMarkdown("nope", "en")).toBeNull();
  });
});

describe("insights overview markdown", () => {
  it("lists posts with linked .md URL, date and summary", () => {
    const md = renderMarkdown("insights", "en");
    expect(md).toContain("# Insights");
    expect(md).toContain(`[Your Company Should Always Be 90 Days from a Sale](https://cefabmanagement.com/en/insights/${SLUG}.md)`);
    expect(md).toContain("29 October 2026");
    expect(md).toContain("A buyer calls and wants a data room in 30 days.");
  });
});
