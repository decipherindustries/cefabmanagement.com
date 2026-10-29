import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getAllPosts, getPost } from "@/lib/insights";
import { LOCALES } from "@/lib/routes";

// Values mirror app/styles/tokens.css (ImageResponse cannot read CSS variables).
const NAVY_900 = "#192333";
const ON_DARK_BODY = "#c5cdda";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Insights by Catherine Cruickshank";
export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getAllPosts();
  return LOCALES.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const font = await fs.readFile(path.join(process.cwd(), "app/[locale]/insights/[slug]/InstrumentSerif-Regular.ttf"));
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
        background: NAVY_900, padding: "80px 88px",
      }}>
        <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: 64, lineHeight: 1.1, color: "#ffffff", maxWidth: 1000 }}>
          {post?.title ?? "Insights"}
        </div>
        <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: 30, color: ON_DARK_BODY }}>
          Catherine Cruickshank · CFO/COO
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Instrument Serif", data: font, style: "normal", weight: 400 }] },
  );
}
