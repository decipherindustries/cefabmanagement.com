import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import type { Dictionary } from "@/content";

// Logos live in /public/logos. Rendered monochrome via CSS mask, so the
// mismatched brand colours unify and white-on-transparent marks (Telio)
// don't disappear on the light strip. Not client-specific copy → not localised.
const LOGOS = [
  { src: "/logos/superyacht-times.svg", alt: "SuperYacht Times" },
  { src: "/logos/yachteye.png", alt: "YachtEye" },
  { src: "/logos/triple-solar.svg", alt: "Triple Solar" },
  { src: "/logos/fleks.png", alt: "Fleks" },
  { src: "/logos/unravel.svg", alt: "Unravel" },
  { src: "/logos/greenflux.svg", alt: "GreenFlux" },
  // Telio omitted: the available asset is an icon-only mark (two squares, no
  // wordmark) that masks to meaningless blocks. Re-add with a full-wordmark logo.
];

export function LogoStrip({ dict }: { dict: Dictionary }) {
  // Duplicated once so the CSS marquee can loop seamlessly (-50% = one set).
  const track = [...LOGOS, ...LOGOS];
  return (
    <section className="ck-logos" aria-label={dict.clients.title}>
      <Container>
        <p className="ck-logos__title">{dict.clients.title}</p>
        <div className="ck-logos__viewport">
          <ul className="ck-logos__track">
            {track.map((logo, i) => (
              <li
                key={`${logo.alt}-${i}`}
                className="ck-logos__item"
                style={{ "--logo": `url(${logo.src})` } as CSSProperties}
                role="img"
                aria-label={logo.alt}
                aria-hidden={i >= LOGOS.length || undefined}
              />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
