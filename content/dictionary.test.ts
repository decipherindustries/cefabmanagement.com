import { describe, it, expect } from "vitest";
import { en } from "./en";
import { nl } from "./nl";

function shape(o: unknown): unknown {
  if (Array.isArray(o)) return o.map(shape);
  if (o && typeof o === "object")
    return Object.fromEntries(Object.keys(o).sort().map((k) => [k, shape((o as Record<string, unknown>)[k])]));
  return typeof o;
}

describe("dictionaries", () => {
  it("en and nl have identical structure", () => {
    expect(shape(en)).toEqual(shape(nl));
  });
  it("have 12 problems, 15 FAQs, 3 tiers, 4 stats", () => {
    for (const d of [en, nl]) {
      expect(d.problems.items).toHaveLength(12);
      expect(d.faq.items).toHaveLength(15);
      expect(d.pricing.tiers).toHaveLength(3);
      expect(d.about.stats).toHaveLength(4);
      expect(d.pricing.tiers.filter((t) => t.popular)).toHaveLength(1);
    }
  });
});
