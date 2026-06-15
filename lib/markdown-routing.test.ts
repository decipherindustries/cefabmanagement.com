import { describe, it, expect } from "vitest";
import { wantsMarkdown, mdInternalPathForPublic, stripMdSuffix } from "./markdown-routing";

describe("markdown-routing", () => {
  it("detects markdown Accept", () => {
    expect(wantsMarkdown("text/markdown")).toBe(true);
    expect(wantsMarkdown("text/markdown, text/plain")).toBe(true);
    expect(wantsMarkdown("text/html,application/xhtml+xml")).toBe(false);
    expect(wantsMarkdown("")).toBe(false);
  });
  it("maps public page paths to internal /m paths", () => {
    expect(mdInternalPathForPublic("/en")).toBe("/m/en");
    expect(mdInternalPathForPublic("/nl/over-mij")).toBe("/m/nl/over-mij");
    expect(mdInternalPathForPublic("/en/contact")).toBe("/m/en/contact");
    expect(mdInternalPathForPublic("/nl/about")).toBeNull(); // English slug under nl is not a public page
    expect(mdInternalPathForPublic("/")).toBeNull();
  });
  it("strips .md suffix", () => {
    expect(stripMdSuffix("/en/about.md")).toBe("/en/about");
    expect(stripMdSuffix("/nl/over-mij.md")).toBe("/nl/over-mij");
    expect(stripMdSuffix("/en")).toBeNull();
  });
});
