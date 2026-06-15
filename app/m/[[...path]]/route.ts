import { LOCALES, PAGE_KEYS, href, resolvePublicPath, type Locale } from "@/lib/routes";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-static";

export function generateStaticParams() {
  // Enumerate every page in every locale using PUBLIC slugs.
  const params: { path: string[] }[] = [];
  for (const pageKey of PAGE_KEYS) {
    for (const locale of LOCALES) {
      const url = href(pageKey, locale); // e.g. "/nl/over-mij" or "/en"
      params.push({ path: url.replace(/^\//, "").split("/") });
    }
  }
  return params;
}

export async function GET(_req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const match = resolvePublicPath("/" + path.join("/"));
  if (!match) return new Response("Not found", { status: 404 });
  const body = renderMarkdown(match.pageKey, match.locale as Locale);
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
