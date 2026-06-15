import { NextRequest, NextResponse } from "next/server";
import { decide } from "@/lib/middleware-logic";
import { wantsMarkdown, mdInternalPathForPublic, stripMdSuffix } from "@/lib/markdown-routing";

// Next.js 16 renamed the `middleware` file convention to `proxy`.
// Same edge runtime + API; handles markdown content-negotiation, locale
// redirect and localised-slug rewrites.
function rewriteTo(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.rewrite(url);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Explicit .md URL → internal markdown route.
  const base = stripMdSuffix(pathname);
  if (base !== null) {
    const target = mdInternalPathForPublic(base);
    return target ? rewriteTo(req, target) : NextResponse.next();
  }

  // 2. Accept: text/markdown on a known page → internal markdown route.
  if (wantsMarkdown(req.headers.get("accept") ?? "")) {
    const target = mdInternalPathForPublic(pathname);
    if (target) return rewriteTo(req, target);
  }

  // 3. Existing locale redirect / localised-slug rewrite (unchanged).
  const decision = decide(pathname, req.headers.get("accept-language") ?? "");
  if (decision.type === "redirect") {
    const url = req.nextUrl.clone();
    url.pathname = decision.to;
    return NextResponse.redirect(url);
  }
  if (decision.type === "rewrite") {
    const url = req.nextUrl.clone();
    url.pathname = decision.to;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/|api/|.*\\..*).*)", // dotless paths (pages) — locale + Accept negotiation
    "/((?!_next/|api/).*\\.md)", // explicit .md URLs
  ],
};
