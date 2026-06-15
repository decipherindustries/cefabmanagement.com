import type { ReactNode } from "react";
import { IconBadge } from "./IconBadge";

export function FeatureCard({ icon, title, children, variant = "card", iconVariant = "dark" }: {
  icon: ReactNode; title: string; children: ReactNode;
  variant?: "card" | "soft"; iconVariant?: "dark" | "plain";
}) {
  return (
    <div className={`cc-feature ${variant === "soft" ? "cc-feature--soft" : ""}`.trim()}>
      {iconVariant === "plain"
        ? <span className="cc-iconbadge cc-iconbadge--plain cc-iconbadge--lg cc-feature__ico">{icon}</span>
        : <IconBadge icon={icon} variant="dark" size="lg" />}
      <h3 className="cc-feature__title">{title}</h3>
      <p className="cc-feature__body">{children}</p>
    </div>
  );
}
