export interface ContactValues {
  name: string; email: string; phone: string; company: string;
  interests: string[]; message: string;
}
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  if (!v.name.trim()) e.name = "required";
  if (!v.email.trim()) e.email = "required";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "invalid";
  if (!v.phone.trim()) e.phone = "required";
  if (!v.message.trim()) e.message = "required";
  return e;
}
