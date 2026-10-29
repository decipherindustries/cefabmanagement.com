import { LOCALES, PAGE_KEYS, href, parsePostPath, postHref, resolvePublicPath, type Locale } from "@/lib/routes";
import { renderMarkdown, renderPostMarkdown } from "@/lib/markdown";
import { getAllPosts } from "@/lib/insights";

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
  for (const post of getAllPosts()) {
    for (const locale of LOCALES) {
      params.push({ path: postHref(post.slug, locale).replace(/^\//, "").split("/") });
    }
  }
  return params;
}

function markdownResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

export async function GET(_req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const pathname = "/" + path.join("/");
  const post = parsePostPath(pathname);
  if (post) {
    const body = renderPostMarkdown(post.slug, post.locale);
    return body === null ? new Response("Not found", { status: 404 }) : markdownResponse(body);
  }
  const match = resolvePublicPath(pathname);
  if (!match) return new Response("Not found", { status: 404 });
  return markdownResponse(renderMarkdown(match.pageKey, match.locale as Locale));
}
