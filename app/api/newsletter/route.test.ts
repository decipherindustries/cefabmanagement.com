import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { subscribeNewsletter, sendNewsletterNotification } from "@/lib/brevo";

vi.mock("@/lib/recaptcha", () => ({ verifyRecaptcha: vi.fn() }));
vi.mock("@/lib/brevo", () => ({
  subscribeNewsletter: vi.fn(),
  sendNewsletterNotification: vi.fn(),
}));

const mockedVerify = vi.mocked(verifyRecaptcha);
const mockedSubscribe = vi.mocked(subscribeNewsletter);
const mockedNotify = vi.mocked(sendNewsletterNotification);

function makeReq(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/newsletter", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedVerify.mockResolvedValue({ ok: true, score: 0.9 });
    mockedSubscribe.mockResolvedValue({ ok: true, status: 204 });
    mockedNotify.mockResolvedValue({ ok: true, status: 201 });
  });

  it("returns 200 and calls nothing when the honeypot is filled", async () => {
    const res = await POST(makeReq({ email: "a@b.co", locale: "en", company_url: "http://spam" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(mockedVerify).not.toHaveBeenCalled();
    expect(mockedSubscribe).not.toHaveBeenCalled();
    expect(mockedNotify).not.toHaveBeenCalled();
  });

  it.each(["x", ""])("returns 400 validation for email %j", async (email) => {
    const res = await POST(makeReq({ email, locale: "en" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "validation" });
    expect(mockedSubscribe).not.toHaveBeenCalled();
  });

  it("returns 400 bad-json for a null body", async () => {
    const res = await POST(makeReq(null));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("bad-json");
  });

  it("returns 400 validation for a non-string email", async () => {
    const res = await POST(makeReq({ email: 123, locale: "en" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("validation");
  });

  it("returns 400 validation for a 255-character email", async () => {
    const res = await POST(makeReq({ email: `${"a".repeat(243)}@example.com`, locale: "en" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("validation");
    expect(mockedSubscribe).not.toHaveBeenCalled();
  });

  it("defaults an unknown locale to en", async () => {
    await POST(makeReq({ email: "a@b.co", locale: "de" }));
    expect(mockedSubscribe).toHaveBeenCalledWith("a@b.co", "en");
  });

  it("returns 403 when captcha fails, verifying with action newsletter", async () => {
    mockedVerify.mockResolvedValue({ ok: false, reason: "low-score" });
    const res = await POST(makeReq({ email: "a@b.co", locale: "nl", captchaToken: "tok" }));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ ok: false, error: "captcha" });
    expect(mockedVerify).toHaveBeenCalledWith("tok", "newsletter");
    expect(mockedSubscribe).not.toHaveBeenCalled();
  });

  it("subscribes and notifies on success", async () => {
    const res = await POST(makeReq({ email: " a@b.co ", locale: "nl" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(mockedSubscribe).toHaveBeenCalledWith("a@b.co", "nl");
    expect(mockedNotify).toHaveBeenCalledWith("a@b.co", "nl");
  });

  it("returns 502 send-failed when Brevo rejects the sign-up", async () => {
    mockedSubscribe.mockResolvedValue({ ok: false, status: 500 });
    const res = await POST(makeReq({ email: "a@b.co", locale: "en" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: "send-failed" });
    expect(mockedNotify).not.toHaveBeenCalled();
  });

  it("returns 500 send-error when subscribeNewsletter throws", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    mockedSubscribe.mockRejectedValue(new Error("BREVO_API_KEY not set"));
    const res = await POST(makeReq({ email: "a@b.co", locale: "en" }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ ok: false, error: "send-error" });
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });

  it("still returns 200 when the notification fails, and logs it", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    mockedNotify.mockRejectedValue(new Error("boom"));
    const res = await POST(makeReq({ email: "a@b.co", locale: "en" }));
    expect(res.status).toBe(200);
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });
});
