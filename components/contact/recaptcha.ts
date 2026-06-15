// Client-side reCAPTCHA v3 helper. The site key is public by design.
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

interface Grecaptcha {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

/**
 * Returns a reCAPTCHA token for the given action, or undefined if reCAPTCHA is
 * not configured / not loaded (in which case the server treats it as disabled).
 */
export async function getRecaptchaToken(action = "contact"): Promise<string | undefined> {
  if (!RECAPTCHA_SITE_KEY) return undefined;
  const grecaptcha = typeof window !== "undefined" ? window.grecaptcha : undefined;
  if (!grecaptcha?.execute) return undefined;
  try {
    return await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
  } catch {
    return undefined;
  }
}
