import { describe, it, expect } from "vitest";
import { decide } from "./middleware-logic";

describe("middleware decide", () => {
  it("redirects root to detected locale home", () => {
    expect(decide("/", "nl,en")).toEqual({ type: "redirect", to: "/nl" });
    expect(decide("/", "en-US,en")).toEqual({ type: "redirect", to: "/en" });
    expect(decide("/", "")).toEqual({ type: "redirect", to: "/nl" }); // default
  });
  it("rewrites a Dutch localised slug to its internal route", () => {
    expect(decide("/nl/over-mij", "")).toEqual({ type: "rewrite", to: "/nl/about" });
  });
  it("redirects an English slug used under nl to the localised canonical", () => {
    expect(decide("/nl/about", "")).toEqual({ type: "redirect", to: "/nl/over-mij" });
  });
  it("passes through already-correct public paths", () => {
    expect(decide("/en/about", "")).toEqual({ type: "next" });
    expect(decide("/nl", "")).toEqual({ type: "next" });
    expect(decide("/en/contact", "")).toEqual({ type: "next" });
  });
  it("ignores unknown paths", () => {
    expect(decide("/en/blog", "")).toEqual({ type: "next" });
  });
});
