import { resolvePublicPath } from "@/lib/routes";

/** True if the Accept header requests markdown (case-insensitive). */
export function wantsMarkdown(accept: string): boolean {
  return accept.toLowerCase().includes("text/markdown");
}

/**
 * Map a normal public page path (e.g. "/en" or "/nl/over-mij") to its internal
 * markdown route ("/m" + pathname), or null if it is not a known public page.
 */
export function mdInternalPathForPublic(pathname: string): string | null {
  if (!resolvePublicPath(pathname)) return null;
  return "/m" + pathname;
}

/** If `pathname` ends with ".md", return it without the suffix; else null. */
export function stripMdSuffix(pathname: string): string | null {
  if (!pathname.endsWith(".md")) return null;
  return pathname.slice(0, -".md".length);
}
