import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendContactEmail } from "@/lib/brevo";

vi.mock("@/lib/recaptcha", () => ({ verifyRecaptcha: vi.fn() }));
vi.mock("@/lib/brevo", () => ({ sendContactEmail: vi.fn() }));

const mockedVerify = vi.mocked(verifyRecaptcha);
const mockedSend = vi.mocked(sendContactEmail);

const valid = {
  name: "Jane",
  email: "jane@acme.co",
  phone: "+31 6 12345678",
  company: "Acme",
  interests: ["Growth"],
  message: "Hello",
};

function makeReq(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedVerify.mockResolvedValue({ ok: true, score: 0.9 });
    mockedSend.mockResolvedValue({ ok: true, status: 201 });
  });

  it("returns 200 and does NOT send when the honeypot is filled", async () => {
    const res = await POST(makeReq({ ...valid, company_url: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(mockedSend).not.toHaveBeenCalled();
  });

  it("returns 400 on invalid input", async () => {
    const res = await POST(makeReq({ ...valid, email: "" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe("validation");
    expect(mockedSend).not.toHaveBeenCalled();
  });

  it("returns 403 and does not send when captcha fails", async () => {
    mockedVerify.mockResolvedValue({ ok: false, reason: "low-score" });
    const res = await POST(makeReq(valid));
    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe("captcha");
    expect(mockedSend).not.toHaveBeenCalled();
  });

  it("returns 200 and sends once on a valid, captcha-ok submission", async () => {
    const res = await POST(makeReq(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(mockedSend).toHaveBeenCalledTimes(1);
    expect(mockedSend).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Jane", email: "jane@acme.co" }),
    );
  });

  it("returns 502 when Brevo reports a failure", async () => {
    mockedSend.mockResolvedValue({ ok: false, status: 500 });
    const res = await POST(makeReq(valid));
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe("send-failed");
  });

  it("returns 400 on malformed JSON", async () => {
    const req = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("bad-json");
  });
});
