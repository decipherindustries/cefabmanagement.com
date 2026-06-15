"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { localizePathname, type Locale } from "@/lib/routes";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const other: Locale = locale === "nl" ? "en" : "nl";
  return (
    <Link className="ck-lang" href={localizePathname(pathname, other)} hrefLang={other}>
      <Globe />
      <span>{other.toUpperCase()}</span>
    </Link>
  );
}
