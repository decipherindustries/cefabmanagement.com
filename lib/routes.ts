export const LOCALES = ["nl", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "nl";

export type PageKey = "home" | "about" | "contact";

/** Internal (file-route) slug per page - English-based, locale-independent. */
const INTERNAL_SLUG: Record<PageKey, string> = {
  home: "",
  about: "about",
  contact: "contact",
};

/** Public slug per page per locale. */
const PUBLIC_SLUG: Record<PageKey, Record<Locale, string>> = {
  home: { nl: "", en: "" },
  about: { nl: "over-mij", en: "about" },
  contact: { nl: "contact", en: "contact" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

function join(locale: Locale, slug: string): string {
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export function href(pageKey: PageKey, locale: Locale): string {
  return join(locale, PUBLIC_SLUG[pageKey][locale]);
}

/** Reverse-lookup a public path → { locale, pageKey }, or null if not a known public page. */
export function resolvePublicPath(pathname: string): { locale: Locale; pageKey: PageKey } | null {
  const parts = pathname.replace(/^\/+|\/+$/g, "").split("/");
  const [maybeLocale, ...rest] = parts;
  if (!isLocale(maybeLocale)) return null;
  const slug = rest.join("/");
  for (const key of Object.keys(PUBLIC_SLUG) as PageKey[]) {
    if (PUBLIC_SLUG[key][maybeLocale] === slug) return { locale: maybeLocale, pageKey: key };
  }
  return null;
}

/** Public path → internal file-route path (for middleware rewrites). */
export function canonicalInternalPath(pathname: string): string {
  const match = resolvePublicPath(pathname);
  if (!match) return pathname;
  return join(match.locale, INTERNAL_SLUG[match.pageKey]);
}

/** Map a path to the equivalent page in `target` locale (localised slug if known). */
export function localizePathname(pathname: string, target: Locale): string {
  const match = resolvePublicPath(pathname);
  if (match) return href(match.pageKey, target);
  // Fallback: swap the leading locale segment.
  const parts = pathname.replace(/^\/+/, "").split("/");
  if (isLocale(parts[0])) {
    parts[0] = target;
    return "/" + parts.join("/");
  }
  return `/${target}`;
}

export const PAGE_KEYS = Object.keys(INTERNAL_SLUG) as PageKey[];
