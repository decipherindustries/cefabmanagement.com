import type { ReactNode } from "react";
export function Field({ id, label, hint, error, required, children }: {
  id: string; label: string; hint?: string; error?: string; required?: boolean; children: ReactNode;
}) {
  return (
    <div className="cc-field">
      <label className="cc-field__label" htmlFor={id}>
        {label}{required && " *"}
      </label>
      {children}
      {error ? <span className="cc-field__hint" style={{ color: "var(--red-600)" }}>{error}</span>
        : hint ? <span className="cc-field__hint">{hint}</span> : null}
    </div>
  );
}
