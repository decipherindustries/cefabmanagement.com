import type { ReactNode } from "react";

export function SectionHead({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="ck-head">
      <h2 className="ck-head__title">{title}</h2>
      {children && <p className="ck-head__sub">{children}</p>}
    </header>
  );
}
