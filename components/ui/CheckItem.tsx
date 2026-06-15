import type { ReactNode } from "react";
import { Check } from "lucide-react";
type Tone = "accent" | "muted" | "onDark";
export function CheckItem({ children, tone = "accent" }: { children: ReactNode; tone?: Tone }) {
  return (
    <div className={`cc-check cc-check--${tone}`}>
      <span className="cc-check__ico"><Check /></span>
      <span className="cc-check__text">{children}</span>
    </div>
  );
}
