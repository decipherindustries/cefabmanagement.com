import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { karla, instrumentSerif } from "@/lib/fonts";
import { SITE_URL } from "@/lib/seo";

// Default social-share image (Catherine's homepage portrait). Pages may override.
const OG_IMAGE = { url: "/portrait-catherine.png", width: 895, height: 1175, alt: "Catherine Cruickshank" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: "Catherine Cruickshank · CFO/COO",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

// GA4 Measurement ID (public — ships in client HTML). Overridable via env.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-FKVV7HJ6MQ";
const gaEnabled =
  !!GA_ID &&
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL_ENV !== "preview";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl" className={`${karla.variable} ${instrumentSerif.variable}`}>
      <body>
        {children}
        <Analytics />
        {gaEnabled ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}
