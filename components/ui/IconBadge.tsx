import type { ReactNode } from "react";
type Variant = "dark" | "tint" | "accent" | "plain";
type Size = "sm" | "md" | "lg";
export function IconBadge({ icon, variant = "dark", size = "lg" }: { icon: ReactNode; variant?: Variant; size?: Size }) {
  return <span className={`cc-iconbadge cc-iconbadge--${variant} cc-iconbadge--${size}`}>{icon}</span>;
}
