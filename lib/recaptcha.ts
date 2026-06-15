export interface RecaptchaResult {
  ok: boolean;
  score?: number;
  reason?: string;
}

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export async function verifyRecaptcha(
  token: string | undefined,
  action = "contact",
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  // If no secret configured (e.g. local dev), skip — treated as pass.
  if (!secret) return { ok: true, reason: "recaptcha-disabled" };
  if (!token) return { ok: false, reason: "missing-token" };

  const params = new URLSearchParams({ secret, response: token });
  const res = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const data = (await res.json()) as { success: boolean; score?: number; action?: string };
  const min = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");
  if (!data.success) return { ok: false, reason: "verification-failed" };
  if (data.action && data.action !== action)
    return { ok: false, score: data.score, reason: "action-mismatch" };
  if (typeof data.score === "number" && data.score < min)
    return { ok: false, score: data.score, reason: "low-score" };
  return { ok: true, score: data.score };
}
