import { NextRequest, NextResponse } from "next/server";
import { EMAIL_RE } from "@/lib/contact-validation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { subscribeNewsletter, sendNewsletterNotification } from "@/lib/brevo";
import { isLocale } from "@/lib/routes";

export async function POST(req: NextRequest) {
  let body: { email?: string; locale?: string; captchaToken?: string; company_url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  // Honeypot: real users never fill `company_url`. Pretend success, do nothing.
  if (body.company_url) return NextResponse.json({ ok: true });

  const email = (body.email ?? "").trim();
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  const locale = body.locale && isLocale(body.locale) ? body.locale : "en";

  const captcha = await verifyRecaptcha(body.captchaToken, "newsletter");
  if (!captcha.ok) return NextResponse.json({ ok: false, error: "captcha" }, { status: 403 });

  try {
    const sub = await subscribeNewsletter(email, locale);
    if (!sub.ok) return NextResponse.json({ ok: false, error: "send-failed" }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, error: "send-error" }, { status: 500 });
  }

  // Best effort: the sign-up already succeeded.
  try {
    await sendNewsletterNotification(email, locale);
  } catch (err) {
    console.error("[newsletter] notification failed", err);
  }
  return NextResponse.json({ ok: true });
}
