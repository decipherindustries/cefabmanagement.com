import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { karla, instrumentSerif } from "@/lib/fonts";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: { type: "website", siteName: "Catherine Cruickshank · CFO/COO" },
  twitter: { card: "summary_large_image" },
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
