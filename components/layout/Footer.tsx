import Link from "next/link";
import { Linkedin, Mail } from "lucide-react";
import { Container } from "./Container";
import { href, type Locale } from "@/lib/routes";
import { SITE } from "@/lib/site";
import type { Dictionary } from "@/content";

export function Footer({ locale, dict, year }: { locale: Locale; dict: Dictionary; year: number }) {
  return (
    <footer className="ck-footer">
      <Container className="ck-footer__grid">
        <div className="ck-footer__brand">
          <div className="ck-logo ck-logo--footer">{SITE.name}</div>
          <p className="ck-footer__tag">{dict.footer.tagline}</p>
          <div className="ck-footer__social">
            <a href={SITE.linkedin} aria-label="LinkedIn"><Linkedin /></a>
            <a href={`mailto:${SITE.email}`} aria-label="Email"><Mail /></a>
          </div>
        </div>
        <div className="ck-footer__col">
          <div className="ck-footer__h">{dict.footer.linksHeading}</div>
          <Link href={href("home", locale)}>{dict.nav.home}</Link>
          <Link href={href("about", locale)}>{dict.nav.about}</Link>
          <Link href={href("contact", locale)}>{dict.nav.contact}</Link>
        </div>
        <div className="ck-footer__col">
          <div className="ck-footer__h">{dict.footer.contactHeading}</div>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={`tel:${SITE.phoneHref}`}>{SITE.phoneDisplay}</a>
        </div>
      </Container>
      <Container className="ck-footer__legal">
        © {year} {SITE.name}. {dict.footer.rights}.
      </Container>
    </footer>
  );
}
