"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function FAQItem({ question, children, defaultOpen = false }: {
  question: string; children: ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const inner = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/refs -- reading scrollHeight here drives the collapse animation; re-render on open toggle picks up the measured height
  const maxH = open ? `${inner.current?.scrollHeight ?? 600}px` : "0px";
  return (
    <div className="cc-faq" data-open={open}>
      <button
        className="cc-faq__btn" aria-expanded={open} aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{question}</span>
        <span className="cc-faq__chev"><ChevronDown /></span>
      </button>
      <div className="cc-faq__panel" id={panelId} aria-hidden={!open} style={{ maxHeight: maxH }}>
        <div className="cc-faq__inner" ref={inner}>{children}</div>
      </div>
    </div>
  );
}
