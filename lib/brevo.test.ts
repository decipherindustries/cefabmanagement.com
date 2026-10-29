import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { sendContactEmail, subscribeNewsletter, sendNewsletterNotification } from "./brevo";
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

describe("sendContactEmail default recipient", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.stubEnv("BREVO_API_KEY", "test-api-key");
    vi.stubEnv("CONTACT_TO_ADDRESS", "");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends to directie@ when CONTACT_TO_ADDRESS is unset", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("BREVO_API_KEY", "test-api-key");
    delete process.env.CONTACT_TO_ADDRESS;
    const fetchFn = mockFetch(true, 201);
    await sendContactEmail(values);
    const body = JSON.parse(fetchFn.mock.calls[0][1].body as string);
    expect(body.to).toEqual([{ email: "directie@cefabmanagement.com" }]);
  });
});

function mockFetchJson(status: number, json?: unknown) {
  const fn = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: "",
    text: async () => (json === undefined ? "" : JSON.stringify(json)),
    json: async () => json,
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

describe("subscribeNewsletter", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.stubEnv("BREVO_API_KEY", "test-api-key");
    vi.stubEnv("BREVO_NEWSLETTER_LIST_ID", "7");
    vi.stubEnv("BREVO_DOI_TEMPLATE_ID", "3");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://cefabmanagement.com");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("POSTs the double opt-in request", async () => {
    const fetchFn = mockFetchJson(204);
    const result = await subscribeNewsletter("jane@acme.co", "nl");
    expect(result).toEqual({ ok: true, status: 204 });
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/contacts/doubleOptinConfirmation");
    expect((init.headers as Record<string, string>)["api-key"]).toBe("test-api-key");
    expect(JSON.parse(init.body as string)).toEqual({
      email: "jane@acme.co",
      includeListIds: [7],
      templateId: 3,
      redirectionUrl: "https://cefabmanagement.com/nl/insights?subscribed=1",
      attributes: { LOCALE: "nl" },
    });
  });

  it("treats 201 as ok", async () => {
    mockFetchJson(201);
    expect((await subscribeNewsletter("jane@acme.co", "en")).ok).toBe(true);
  });

  it("treats a duplicate_parameter 400 as ok", async () => {
    mockFetchJson(400, { code: "duplicate_parameter", message: "exists" });
    const result = await subscribeNewsletter("jane@acme.co", "en");
    expect(result).toEqual({ ok: true, status: 400 });
  });

  it("returns ok: false and logs for other failures", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetchJson(400, { code: "invalid_parameter" });
    expect((await subscribeNewsletter("jane@acme.co", "en")).ok).toBe(false);
    mockFetchJson(500);
    expect((await subscribeNewsletter("jane@acme.co", "en")).ok).toBe(false);
    expect(err).toHaveBeenCalledTimes(2);
  });

  it("throws when the list id is missing or not a number", async () => {
    vi.stubEnv("BREVO_NEWSLETTER_LIST_ID", "");
    await expect(subscribeNewsletter("a@b.co", "en")).rejects.toThrow("BREVO_NEWSLETTER_LIST_ID not set");
  });

  it("throws when the template id is missing", async () => {
    vi.stubEnv("BREVO_DOI_TEMPLATE_ID", "");
    await expect(subscribeNewsletter("a@b.co", "en")).rejects.toThrow("BREVO_DOI_TEMPLATE_ID not set");
  });
});

describe("sendNewsletterNotification", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.stubEnv("BREVO_API_KEY", "test-api-key");
    delete process.env.NEWSLETTER_NOTIFY_ADDRESS;
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends to the default address with email and locale", async () => {
    const fetchFn = mockFetchJson(201);
    const result = await sendNewsletterNotification("jane@acme.co", "nl");
    expect(result.ok).toBe(true);
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    const body = JSON.parse(init.body as string);
    expect(body.to).toEqual([{ email: "directie@cefabmanagement.com" }]);
    expect(body.subject).toContain("jane@acme.co");
    expect(body.subject).toContain("confirmation pending");
    expect(body.textContent).toContain("nl");
  });

  it("uses NEWSLETTER_NOTIFY_ADDRESS when set", async () => {
    vi.stubEnv("NEWSLETTER_NOTIFY_ADDRESS", "other@cefabmanagement.com");
    const fetchFn = mockFetchJson(201);
    await sendNewsletterNotification("jane@acme.co", "en");
    const body = JSON.parse(fetchFn.mock.calls[0][1].body as string);
    expect(body.to).toEqual([{ email: "other@cefabmanagement.com" }]);
  });
});
