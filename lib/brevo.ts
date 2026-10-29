import type { ContactValues } from "@/lib/contact-validation";
import { renderContactEmail, escapeHtml } from "@/lib/contact-email";
import type { Locale } from "@/lib/routes";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_DOI_URL = "https://api.brevo.com/v3/contacts/doubleOptinConfirmation";
const DEFAULT_NOTIFY_ADDRESS = "directie@cefabmanagement.com";

export async function sendContactEmail(
  values: ContactValues,
): Promise<{ ok: boolean; status: number }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY not set");
  const { subject, html, text } = renderContactEmail(values);
  const payload = {
    sender: {
      name: process.env.BREVO_FROM_NAME ?? "Contact form",
      email: process.env.BREVO_FROM_ADDRESS ?? "noreply@cefabmanagement.com",
    },
    to: [{ email: process.env.CONTACT_TO_ADDRESS ?? DEFAULT_NOTIFY_ADDRESS }],
    replyTo: { email: values.email, name: values.name || undefined },
    subject,
    htmlContent: html,
    textContent: text,
  };
  const res = await fetch(BREVO_URL, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      /* ignore body read errors */
    }
    // Logged to the server (Vercel) only - never returned to the client.
    console.error(
      `[brevo] send failed: ${res.status} ${res.statusText} - from=${payload.sender.email} to=${payload.to[0]?.email} - ${detail}`,
    );
  }
  return { ok: res.ok, status: res.status };
}

/** Read an env var holding a numeric Brevo id; NaN or empty counts as not set. */
function numericEnv(name: string): number {
  const raw = process.env[name];
  const n = raw ? Number(raw) : NaN;
  if (Number.isNaN(n)) throw new Error(`${name} not set`);
  return n;
}

async function readDetail(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

/** Start a Brevo double opt-in sign-up; Brevo sends the confirmation email. */
export async function subscribeNewsletter(
  email: string,
  locale: Locale,
): Promise<{ ok: boolean; status: number }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY not set");
  const listId = numericEnv("BREVO_NEWSLETTER_LIST_ID");
  const templateId = numericEnv("BREVO_DOI_TEMPLATE_ID");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cefabmanagement.com";
  const res = await fetch(BREVO_DOI_URL, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      email,
      includeListIds: [listId],
      templateId,
      redirectionUrl: `${siteUrl}/${locale}/insights?subscribed=1`,
      attributes: { LOCALE: locale },
    }),
  });
  if (res.ok) return { ok: true, status: res.status };
  const detail = await readDetail(res);
  // Already on the list: not an error for the visitor.
  if (res.status === 400) {
    try {
      const parsed = JSON.parse(detail);
      if (parsed?.code === "duplicate_parameter" || /already exist/i.test(String(parsed?.message ?? "")))
        return { ok: true, status: res.status };
    } catch {
      /* not JSON */
    }
  }
  // Logged to the server (Vercel) only - never returned to the client.
  console.error(`[brevo] newsletter sign-up failed: ${res.status} ${res.statusText} - ${detail}`);
  return { ok: false, status: res.status };
}

/** Tell the team a sign-up is waiting for its confirmation click. */
export async function sendNewsletterNotification(
  email: string,
  locale: Locale,
): Promise<{ ok: boolean; status: number }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY not set");
  const to = process.env.NEWSLETTER_NOTIFY_ADDRESS || DEFAULT_NOTIFY_ADDRESS;
  const safeEmail = email.replace(/[\r\n]+/g, " ").trim();
  const payload = {
    sender: {
      name: process.env.BREVO_FROM_NAME ?? "Contact form",
      email: process.env.BREVO_FROM_ADDRESS ?? "noreply@cefabmanagement.com",
    },
    to: [{ email: to }],
    subject: `Newsletter sign-up - ${safeEmail} (confirmation pending)`,
    htmlContent: `<p>${escapeHtml(safeEmail)} signed up for the newsletter (locale: ${locale}). The sign-up is pending until they confirm by email.</p>`,
    textContent: `${safeEmail} signed up for the newsletter (locale: ${locale}). The sign-up is pending until they confirm by email.`,
  };
  const res = await fetch(BREVO_URL, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error(
      `[brevo] newsletter notification failed: ${res.status} ${res.statusText} - to=${to} - ${await readDetail(res)}`,
    );
  }
  return { ok: res.ok, status: res.status };
}
