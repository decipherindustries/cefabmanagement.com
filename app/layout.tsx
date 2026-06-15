import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { karla, instrumentSerif } from "@/lib/fonts";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl" className={`${karla.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
