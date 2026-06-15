"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { href, type Locale } from "@/lib/routes";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function MobileMenu({
  locale,
  nav,
}: {
  locale: Locale;
  nav: { home: string; about: string; contact: string; faq: string };
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ck-mobile">
      <button
        className="ck-mobile__btn"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <div className="ck-mobile__drawer" role="dialog" aria-modal="true">
          <Link href={href("home", locale)} onClick={() => setOpen(false)}>
            {nav.home}
          </Link>
          <Link href={href("about", locale)} onClick={() => setOpen(false)}>
            {nav.about}
          </Link>
          <Link href={href("faq", locale)} onClick={() => setOpen(false)}>
            {nav.faq}
          </Link>
          <Link href={href("contact", locale)} onClick={() => setOpen(false)}>
            {nav.contact}
          </Link>
          <LanguageSwitcher locale={locale} />
        </div>
      )}
    </div>
  );
}
