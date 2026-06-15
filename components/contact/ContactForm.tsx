"use client";
import { useState, type FormEvent } from "react";
import Script from "next/script";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { validateContact, type ContactValues, type ContactErrors } from "@/lib/contact-validation";
import { RECAPTCHA_SITE_KEY, getRecaptchaToken } from "./recaptcha";
import type { Dictionary } from "@/content";

const EMPTY: ContactValues = { name: "", email: "", phone: "", company: "", interests: [], message: "" };

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({ dict }: { dict: Dictionary }) {
  const c = dict.contact;
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  // Honeypot: real users never fill this. Bots that auto-fill all inputs will.
  const [companyUrl, setCompanyUrl] = useState("");

  function set<K extends keyof ContactValues>(key: K, val: ContactValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }
  function toggleInterest(label: string, on: boolean) {
    set("interests", on ? [...values.interests, label] : values.interests.filter((x) => x !== label));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateContact(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("sending");
    try {
      const captchaToken = await getRecaptchaToken("contact");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, captchaToken, company_url: companyUrl }),
      });
      const data = (await res.json().catch(() => ({ ok: false }))) as { ok?: boolean };
      if (res.ok && data.ok) {
        setStatus("sent");
        setValues(EMPTY);
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <div className="cc-card cc-card--soft cc-card--pad-lg" role="status">{c.success}</div>;
  }

  const sending = status === "sending";

  return (
    <>
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}
      <form className="ck-form" onSubmit={onSubmit} noValidate>
        <Field id="name" label={c.name} required error={errors.name && c.name}>
          <Input id="name" value={values.name} aria-invalid={!!errors.name}
            onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field id="email" label={c.email} required error={errors.email && c.email}>
          <Input id="email" type="email" value={values.email} aria-invalid={!!errors.email}
            onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field id="phone" label={c.phone} required error={errors.phone && c.phone}>
          <Input id="phone" type="tel" value={values.phone} aria-invalid={!!errors.phone}
            onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field id="company" label={c.company}>
          <Input id="company" value={values.company} onChange={(e) => set("company", e.target.value)} />
        </Field>
        <fieldset className="ck-form__interests">
          <legend className="cc-field__label">{c.interest}</legend>
          {c.tiers.map((t, i) => (
            <Checkbox key={t} id={`interest-${i}`} label={t}
              checked={values.interests.includes(t)} onChange={(on) => toggleInterest(t, on)} />
          ))}
        </fieldset>
        <Field id="message" label={c.message} required error={errors.message && c.message}>
          <Textarea id="message" value={values.message} aria-invalid={!!errors.message}
            onChange={(e) => set("message", e.target.value)} />
        </Field>

        {/* Honeypot - visually hidden, never shown to real users. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
          <label htmlFor="company_url">Company URL</label>
          <input
            id="company_url"
            name="company_url"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={companyUrl}
            onChange={(e) => setCompanyUrl(e.target.value)}
          />
        </div>

        {status === "error" && (
          <p className="cc-field__error" role="alert">{c.error}</p>
        )}

        <Button type="submit" variant="primary" size="lg" disabled={sending}>
          {sending ? c.sending : c.send}
        </Button>
      </form>
    </>
  );
}
