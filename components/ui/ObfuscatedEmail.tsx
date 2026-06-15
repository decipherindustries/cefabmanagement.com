"use client";
import { useEffect, useState, type ReactNode } from "react";

// Build the address from parts so the verbatim string never appears in source/SSR HTML.
const user = "catherine";
const domain = ["cefabmanagement", "com"].join(".");
const addr = `${user}@${domain}`;
const obfuscated = `${user} [at] ${domain.replace(/\./g, " [dot] ")}`;

export function ObfuscatedEmail({
  className,
  iconOnly = false,
  children,
}: {
  className?: string;
  iconOnly?: boolean;
  children?: ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer the real mailto until after hydration so the address is never in SSR HTML; first client render must match server output
  useEffect(() => setRevealed(true), []);

  if (iconOnly) {
    if (!revealed) {
      return (
        <span className={className} aria-label="Email">
          {children}
        </span>
      );
    }
    return (
      <a className={className} href={`mailto:${addr}`} aria-label="Email">
        {children}
      </a>
    );
  }

  if (!revealed) {
    return <span className={className}>{obfuscated}</span>;
  }
  return (
    <a className={className} href={`mailto:${addr}`}>
      {addr}
    </a>
  );
}
