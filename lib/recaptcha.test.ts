import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { verifyRecaptcha } from "./recaptcha";

function mockFetch(json: Record<string, unknown>) {
  const fn = vi.fn().mockResolvedValue({ json: () => Promise.resolve(json) });
  vi.stubGlobal("fetch", fn);
  return fn;
}

describe("verifyRecaptcha", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns ok (disabled) and does not call fetch when no secret is set", async () => {
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "");
    const fetchFn = mockFetch({ success: true, score: 0.9 });
    const result = await verifyRecaptcha("tok");
    expect(result).toEqual({ ok: true, reason: "recaptcha-disabled" });
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("returns ok when verification succeeds with a high score", async () => {
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "secret");
    mockFetch({ success: true, score: 0.9, action: "contact" });
    const result = await verifyRecaptcha("tok");
    expect(result.ok).toBe(true);
    expect(result.score).toBe(0.9);
  });

  it("returns not ok with low-score reason when score below the minimum", async () => {
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "secret");
    vi.stubEnv("RECAPTCHA_MIN_SCORE", "0.5");
    mockFetch({ success: true, score: 0.1 });
    const result = await verifyRecaptcha("tok");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("low-score");
  });

  it("returns not ok when google reports success: false", async () => {
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "secret");
    mockFetch({ success: false });
    const result = await verifyRecaptcha("tok");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("verification-failed");
  });

  it("returns not ok with missing-token and does not call fetch when token absent", async () => {
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "secret");
    const fetchFn = mockFetch({ success: true, score: 0.9 });
    const result = await verifyRecaptcha(undefined);
    expect(result).toEqual({ ok: false, reason: "missing-token" });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});
