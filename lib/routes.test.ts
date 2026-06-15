import { describe, it, expect } from "vitest";
import {
  LOCALES, DEFAULT_LOCALE, isLocale, href, localizePathname,
  resolvePublicPath, canonicalInternalPath,
} from "./routes";

describe("routes", () => {
  it("declares nl + en, default nl", () => {
    expect(LOCALES).toEqual(["nl", "en"]);
    expect(DEFAULT_LOCALE).toBe("nl");
  });

  it("isLocale guards", () => {
    expect(isLocale("nl")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("builds localised hrefs per page key", () => {
    expect(href("home", "en")).toBe("/en");
    expect(href("home", "nl")).toBe("/nl");
    expect(href("about", "en")).toBe("/en/about");
    expect(href("about", "nl")).toBe("/nl/over-mij");
    expect(href("contact", "en")).toBe("/en/contact");
    expect(href("contact", "nl")).toBe("/nl/contact");
  });

  it("maps a current path to the same page in the other locale", () => {
    expect(localizePathname("/en/about", "nl")).toBe("/nl/over-mij");
    expect(localizePathname("/nl/over-mij", "en")).toBe("/en/about");
    expect(localizePathname("/en", "nl")).toBe("/nl");
    // unknown path → just swap the locale prefix
    expect(localizePathname("/en/whatever", "nl")).toBe("/nl/whatever");
  });

  it("resolvePublicPath identifies the page key + locale from a public URL", () => {
    expect(resolvePublicPath("/nl/over-mij")).toEqual({ locale: "nl", pageKey: "about" });
    expect(resolvePublicPath("/en/about")).toEqual({ locale: "en", pageKey: "about" });
    expect(resolvePublicPath("/nl")).toEqual({ locale: "nl", pageKey: "home" });
    expect(resolvePublicPath("/nl/about")).toBeNull(); // English slug under nl is NOT public
    expect(resolvePublicPath("/fr")).toBeNull();
  });

  it("canonicalInternalPath rewrites a public path to its file route", () => {
    expect(canonicalInternalPath("/nl/over-mij")).toBe("/nl/about");
    expect(canonicalInternalPath("/en/about")).toBe("/en/about");
    expect(canonicalInternalPath("/nl")).toBe("/nl");
  });
});
