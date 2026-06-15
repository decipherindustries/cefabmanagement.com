import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "inverse" | "accent" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  iconRight?: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export function Button({
  children, variant = "primary", size = "md", href, iconRight, type = "button", disabled, onClick, target, rel,
}: Props) {
  const cls = `cc-btn cc-btn--${size} cc-btn--${variant}`;
  const inner = (
    <>
      {children}
      {iconRight && <span className="cc-btn__icon">{iconRight}</span>}
    </>
  );
  if (href) return <Link className={cls} href={href} target={target} rel={rel}>{inner}</Link>;
  return (
    <button className={cls} type={type} disabled={disabled} onClick={onClick}>
      {inner}
    </button>
  );
}
