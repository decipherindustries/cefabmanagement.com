import { LOCALES, PAGE_KEYS, href, postHref } from "@/lib/routes";
import { getAllPosts } from "@/lib/insights";
import { SITE } from "@/lib/site";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    `# ${SITE.name} · Fractional CFO/COO`,
    "",
    "> Markdown versions of cefabmanagement.com, for AI agents. Append `.md` to any page URL, or send `Accept: text/markdown`.",
    "",
    "## Pages",
  ];
  for (const pageKey of PAGE_KEYS) {
    for (const locale of LOCALES) {
      const url = `${SITE_URL}${href(pageKey, locale)}`;
      lines.push(`- [${pageKey} (${locale})](${url}.md)`);
    }
  }
  lines.push("", "## Insights");
  for (const post of getAllPosts()) {
    lines.push(`- [${post.title}](${SITE_URL}${postHref(post.slug, "en")}.md)`);
  }
  lines.push("");
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
