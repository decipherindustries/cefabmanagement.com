import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import type { Dictionary } from "@/content";

// Logos live in /public/logos, set as CSS background-images and unified with a
// grayscale filter + opacity (see components.css). Grayscale - not alpha-masking
// - so filled marks like Telio (red/grey squares) render correctly rather than
// collapsing to a solid block. Not client-specific copy → not localised.
const LOGOS: { src: string; alt: string; mod?: string }[] = [
  { src: "/logos/superyacht-times.svg", alt: "SuperYacht Times" },
  { src: "/logos/yachteye.png", alt: "YachtEye" },
  { src: "/logos/triple-solar.svg", alt: "Triple Solar" },
  { src: "/logos/fleks.png", alt: "Fleks" },
  { src: "/logos/unravel.svg", alt: "Unravel" },
  { src: "/logos/greenflux.svg", alt: "GreenFlux" },
  { src: "/logos/telio.png", alt: "Telio", mod: "telio" },
];

// `tail` adds bottom spacing for when the strip is the last block before the
// footer (About / Contact); the home strip sits mid-page and doesn't need it.
export function LogoStrip({ dict, tail = false }: { dict: Dictionary; tail?: boolean }) {
  // Duplicated once so the CSS marquee can loop seamlessly (-50% = one set).
  const track = [...LOGOS, ...LOGOS];
  return (
    <section className={`ck-logos${tail ? " ck-logos--tail" : ""}`} aria-label={dict.clients.title}>
      <Container>
        <p className="ck-logos__title">{dict.clients.title}</p>
        <div className="ck-logos__viewport">
          <div className="ck-logos__track">
            {track.map((logo, i) => (
              <span
                key={`${logo.alt}-${i}`}
                className={`ck-logos__item${logo.mod ? ` ck-logos__item--${logo.mod}` : ""}`}
                style={{ "--logo": `url(${logo.src})` } as CSSProperties}
                role="img"
                aria-label={logo.alt}
                aria-hidden={i >= LOGOS.length || undefined}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
