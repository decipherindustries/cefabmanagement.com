import {
  DEFAULT_LOCALE, isLocale, resolvePublicPath, canonicalInternalPath,
  href, type Locale,
} from "@/lib/routes";

export type Decision =
  | { type: "next" }
  | { type: "redirect"; to: string }
  | { type: "rewrite"; to: string };

export function detectLocale(acceptLanguage: string): Locale {
  const lower = acceptLanguage.toLowerCase();
  for (const part of lower.split(",")) {
    const tag = part.split(";")[0].trim();
    if (tag.startsWith("nl")) return "nl";
    if (tag.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}

export function decide(pathname: string, acceptLanguage: string): Decision {
  if (pathname === "/" || pathname === "") {
    return { type: "redirect", to: `/${detectLocale(acceptLanguage)}` };
  }
  const parts = pathname.replace(/^\/+/, "").split("/");
  if (!isLocale(parts[0])) return { type: "next" };
  const locale = parts[0] as Locale;

  // Already a valid public page for this locale?
  const match = resolvePublicPath(pathname);
  if (match) {
    const internal = canonicalInternalPath(pathname);
    return internal === pathname ? { type: "next" } : { type: "rewrite", to: internal };
  }

  // Not public: is it the English canonical slug under a non-en locale? → redirect to localised.
  const slug = parts.slice(1).join("/");
  if (locale !== "en") {
    const guess = resolvePublicPath(`/en/${slug}`);
    if (guess) return { type: "redirect", to: href(guess.pageKey, locale) };
  }
  return { type: "next" };
}
