import { NextRequest, NextResponse } from "next/server";
import { decide } from "@/lib/middleware-logic";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
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
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
