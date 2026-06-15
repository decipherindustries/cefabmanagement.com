import type { ReactNode } from "react";
import { Container } from "./Container";

export function Section({ children, band = false, label }: { children: ReactNode; band?: boolean; label?: string }) {
  return (
    <section className={`ck-section ${band ? "ck-section--band" : ""}`.trim()} aria-label={label}>
      <Container>{children}</Container>
    </section>
  );
}
