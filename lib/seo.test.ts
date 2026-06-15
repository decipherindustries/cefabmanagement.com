import { describe, it, expect } from "vitest";
import { buildAlternates, personJsonLd } from "./seo";

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
});
