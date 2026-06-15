import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { sendContactEmail } from "./brevo";
import type { ContactValues } from "./contact-validation";

const values: ContactValues = {
  name: "Jane Doe",
  email: "jane@acme.co",
  phone: "+31 6 12345678",
  company: "Acme",
  interests: ["Growth"],
  message: "Hello there",
};

function mockFetch(ok: boolean, status: number) {
  const fn = vi.fn().mockResolvedValue({ ok, status });
  vi.stubGlobal("fetch", fn);
  return fn;
}

describe("sendContactEmail", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.stubEnv("BREVO_API_KEY", "test-api-key");
    vi.stubEnv("BREVO_FROM_ADDRESS", "noreply@cefabmanagement.com");
    vi.stubEnv("CONTACT_TO_ADDRESS", "catherine@cefabmanagement.com");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("POSTs to Brevo with the correct sender, recipient, reply-to and api-key header", async () => {
    const fetchFn = mockFetch(true, 201);
    const result = await sendContactEmail(values);
    expect(result).toEqual({ ok: true, status: 201 });
    expect(fetchFn).toHaveBeenCalledTimes(1);

    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect((init.headers as Record<string, string>)["api-key"]).toBe("test-api-key");

    const body = JSON.parse(init.body as string);
    expect(body.sender.email).toBe("noreply@cefabmanagement.com");
    expect(body.to[0].email).toBe("catherine@cefabmanagement.com");
    expect(body.replyTo.email).toBe("jane@acme.co");
    expect(body.subject).toContain("Jane Doe");
  });

  it("returns ok: false for a non-2xx Brevo response", async () => {
    mockFetch(false, 500);
    const result = await sendContactEmail(values);
    expect(result).toEqual({ ok: false, status: 500 });
  });

  it("throws when BREVO_API_KEY is not set", async () => {
    vi.stubEnv("BREVO_API_KEY", "");
    await expect(sendContactEmail(values)).rejects.toThrow("BREVO_API_KEY not set");
  });
});
