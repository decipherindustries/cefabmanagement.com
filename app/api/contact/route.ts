import { NextRequest, NextResponse } from "next/server";
import { validateContact, type ContactValues } from "@/lib/contact-validation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendContactEmail } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  let body: ContactValues & { captchaToken?: string; company_url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  // Honeypot: real users never fill `company_url`. Pretend success, send nothing.
  if (body.company_url) return NextResponse.json({ ok: true });

  const values: ContactValues = {
    name: body.name ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    company: body.company ?? "",
    interests: body.interests ?? [],
    message: body.message ?? "",
  };
  const errors = validateContact(values);
  if (Object.keys(errors).length)
    return NextResponse.json({ ok: false, error: "validation", errors }, { status: 400 });

  const captcha = await verifyRecaptcha(body.captchaToken);
  if (!captcha.ok) return NextResponse.json({ ok: false, error: "captcha" }, { status: 403 });

  try {
    const sent = await sendContactEmail(values);
    if (!sent.ok) return NextResponse.json({ ok: false, error: "send-failed" }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, error: "send-error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
