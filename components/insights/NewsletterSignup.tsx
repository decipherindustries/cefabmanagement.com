"use client";
import { useId, useState, type FormEvent } from "react";
import Script from "next/script";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EMAIL_RE } from "@/lib/contact-validation";
import { RECAPTCHA_SITE_KEY, getRecaptchaToken } from "@/components/contact/recaptcha";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/routes";

type Status = "idle" | "sending" | "sent" | "error";

const VISUALLY_HIDDEN = {
  position: "absolute", width: 1, height: 1, margin: -1, padding: 0,
  overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0,
} as const;

export function NewsletterSignup({ dict, locale, tone }: { dict: Dictionary; locale: Locale; tone: "dark" | "light" }) {
  const n = dict.insights.newsletter;
  const id = useId();
  const emailId = `${id}-email`;
  const honeypotId = `${id}-company_url`;
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  // Honeypot: real users never fill this. Bots that auto-fill all inputs will.
  const [companyUrl, setCompanyUrl] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const bad = !EMAIL_RE.test(email.trim());
    setInvalid(bad);
    if (bad) return;

    setStatus("sending");
    try {
      const captchaToken = await getRecaptchaToken("newsletter");
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale, captchaToken, company_url: companyUrl }),
      });
      const data = (await res.json().catch(() => ({ ok: false }))) as { ok?: boolean };
      if (res.ok && data.ok) {
        setStatus("sent");
        setEmail("");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <section className={`ck-newsletter ck-newsletter--${tone}`}>
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}
      <h3 className="ck-newsletter__title">{n.title}</h3>
      <p className="ck-newsletter__body">{n.body}</p>
      {status === "sent" ? (
        <p className="ck-newsletter__success" role="status">{n.success}</p>
      ) : (
        <form className="ck-newsletter__form" onSubmit={onSubmit} noValidate>
          <label htmlFor={emailId} style={VISUALLY_HIDDEN}>{n.placeholder}</label>
          <Input id={emailId} type="email" name="email" autoComplete="email" placeholder={n.placeholder}
            value={email} aria-invalid={invalid} aria-describedby={invalid ? `${emailId}-error` : undefined}
            onChange={(e) => setEmail(e.target.value)} />
          {invalid && <span id={`${emailId}-error`} className="cc-field__hint" style={{ color: "var(--red-600)" }}>{dict.contact.email}</span>}

          {/* Honeypot - visually hidden, never shown to real users. */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
            <label htmlFor={honeypotId}>Company URL</label>
            <input id={honeypotId} name="company_url" type="text" tabIndex={-1} autoComplete="off"
              value={companyUrl} onChange={(e) => setCompanyUrl(e.target.value)} />
          </div>

          {status === "error" && <p className="cc-field__error" role="alert">{n.error}</p>}

          <Button type="submit" variant="primary" size="lg" disabled={sending}>
            {sending ? n.sending : n.submit}
          </Button>
          <p className="ck-newsletter__note">{n.note}</p>
        </form>
      )}
    </section>
  );
}
