import type { ContactValues } from "@/lib/contact-validation";
import { renderContactEmail } from "@/lib/contact-email";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

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
    to: [{ email: process.env.CONTACT_TO_ADDRESS ?? "catherine@cefabmanagement.com" }],
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
    // Logged to the server (Vercel) only — never returned to the client.
    console.error(
      `[brevo] send failed: ${res.status} ${res.statusText} — from=${payload.sender.email} to=${payload.to[0]?.email} — ${detail}`,
    );
  }
  return { ok: res.ok, status: res.status };
}
