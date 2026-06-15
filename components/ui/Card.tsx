import type { ReactNode } from "react";
type Fill = "card" | "soft" | "dark" | "flat";
type Pad = "sm" | "md" | "lg";
export function Card({ children, fill = "card", pad = "md", hover = false, className = "" }: {
  children: ReactNode; fill?: Fill; pad?: Pad; hover?: boolean; className?: string;
}) {
  const fillCls = fill === "card" ? "" : `cc-card--${fill}`;
  return (
    <div className={`cc-card ${fillCls} cc-card--pad-${pad} ${hover ? "cc-card--hover" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}
