import type { ContactValues } from "@/lib/contact-validation";

export interface ContactEmailValues extends ContactValues {
  locale?: string;
}

/** Escape a string for safe interpolation into HTML. */
export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const NAVY = "#192333";
const INK = "#192333";
const BLUE = "#165DFC";
const BORDER = "#e2e5ea";
const MUTED = "#5b6472";
const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function joinInterests(interests: string[]): string {
  return interests && interests.length ? interests.join(", ") : "—";
}

function row(label: string, value: string, isLink = false): string {
  const cell = isLink
    ? `<a href="mailto:${escapeHtml(value)}" style="color:${BLUE};text-decoration:none;">${escapeHtml(value)}</a>`
    : escapeHtml(value || "—");
  return `
    <tr>
      <td style="padding:10px 16px 10px 0;vertical-align:top;font-family:${SANS};font-size:13px;font-weight:600;color:${MUTED};white-space:nowrap;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;vertical-align:top;font-family:${SANS};font-size:14px;color:${INK};">${cell}</td>
    </tr>`;
}

export function renderContactEmail(values: ContactEmailValues): {
  subject: string;
  html: string;
  text: string;
} {
  const name = (values.name || "").replace(/[\r\n]+/g, " ").trim();
  const subject = `New contact enquiry — ${name || "(no name)"}`;
  const interests = joinInterests(values.interests);

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid ${BORDER};">
          <tr>
            <td style="background:${NAVY};padding:28px 32px;">
              <h1 style="margin:0;font-family:${SERIF};font-size:22px;font-weight:400;color:#ffffff;letter-spacing:0.2px;">New contact enquiry</h1>
              <p style="margin:6px 0 0;font-family:${SANS};font-size:13px;color:#aeb6c4;">cefabmanagement.com</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row("Name", values.name)}
                ${row("Email", values.email, true)}
                ${row("Phone", values.phone)}
                ${row("Company", values.company)}
                ${row("Interests", interests)}
              </table>
              <div style="margin-top:20px;">
                <p style="margin:0 0 8px;font-family:${SANS};font-size:13px;font-weight:600;color:${MUTED};">Message</p>
                <div style="font-family:${SANS};font-size:14px;line-height:1.6;color:${INK};white-space:pre-wrap;border:1px solid ${BORDER};border-radius:6px;padding:14px 16px;background:#fafbfc;">${escapeHtml(values.message || "—")}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;border-top:1px solid ${BORDER};">
              <p style="margin:0;font-family:${SANS};font-size:12px;color:${MUTED};">Sent from the cefabmanagement.com contact form.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    "New contact enquiry",
    "",
    `Name:      ${values.name || "—"}`,
    `Email:     ${values.email || "—"}`,
    `Phone:     ${values.phone || "—"}`,
    `Company:   ${values.company || "—"}`,
    `Interests: ${interests}`,
    "",
    "Message:",
    values.message || "—",
    "",
    "—",
    "Sent from the cefabmanagement.com contact form.",
  ].join("\n");

  return { subject, html, text };
}
