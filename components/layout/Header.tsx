import Link from "next/link";
import { Container } from "./Container";
import { href, type Locale } from "@/lib/routes";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

export function Header({
  locale,
  nav,
}: {
  locale: Locale;
  nav: { home: string; about: string; contact: string };
}) {
  return (
    <header className="ck-header">
      <Container className="ck-header__inner">
        <Link className="ck-logo" href={href("home", locale)}>
          Catherine Cruickshank <span className="ck-logo__sep">·</span> CFO/COO
        </Link>
        <nav className="ck-nav">
          <Link className="ck-nav__link" href={href("home", locale)}>
            {nav.home}
          </Link>
          <Link className="ck-nav__link" href={href("about", locale)}>
            {nav.about}
          </Link>
          <Link className="ck-nav__link" href={href("contact", locale)}>
            {nav.contact}
          </Link>
          <LanguageSwitcher locale={locale} />
        </nav>
        <MobileMenu locale={locale} nav={nav} />
      </Container>
    </header>
  );
}
