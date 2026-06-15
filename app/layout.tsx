import "./globals.css";
import type { ReactNode } from "react";
import { karla, instrumentSerif } from "@/lib/fonts";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${karla.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
