import type { ReactNode } from "react";
type Variant = "subtle" | "solid" | "accent" | "tint" | "neutral" | "outline";
export function Badge({ children, variant = "subtle" }: { children: ReactNode; variant?: Variant }) {
  return <span className={`cc-badge cc-badge--${variant}`}>{children}</span>;
}
