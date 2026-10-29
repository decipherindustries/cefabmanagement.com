import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterSignup } from "./NewsletterSignup";
import { SubscribedNotice } from "./SubscribedNotice";
import { en } from "@/content/en";

vi.mock("@/components/contact/recaptcha", () => ({
  RECAPTCHA_SITE_KEY: "",
  getRecaptchaToken: vi.fn().mockResolvedValue("tok"),
}));

const n = en.insights.newsletter;

function mockFetch(ok: boolean, json: Record<string, unknown>) {
  const fn = vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(json) });
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState({}, "", "/");
});

describe("NewsletterSignup", () => {
  it("posts the email and shows success", async () => {
    const fetchFn = mockFetch(true, { ok: true });
    render(<NewsletterSignup dict={en} locale="en" tone="dark" />);
    await userEvent.type(screen.getByLabelText(n.placeholder), "jane@acme.co");
    await userEvent.click(screen.getByRole("button", { name: n.submit }));

    expect(await screen.findByText(n.success)).toBeInTheDocument();
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe("/api/newsletter");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      email: "jane@acme.co",
      locale: "en",
      captchaToken: "tok",
      company_url: "",
    });
  });

  it("shows a field error and does not call fetch for an invalid email", async () => {
    const fetchFn = mockFetch(true, { ok: true });
    render(<NewsletterSignup dict={en} locale="en" tone="light" />);
    await userEvent.type(screen.getByLabelText(n.placeholder), "nope");
    await userEvent.click(screen.getByRole("button", { name: n.submit }));

    expect(screen.getByLabelText(n.placeholder)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText(en.contact.email)).toBeInTheDocument();
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("shows the error message on a non-ok response", async () => {
    mockFetch(false, { ok: false, error: "send-failed" });
    render(<NewsletterSignup dict={en} locale="en" tone="dark" />);
    await userEvent.type(screen.getByLabelText(n.placeholder), "jane@acme.co");
    await userEvent.click(screen.getByRole("button", { name: n.submit }));

    expect(await screen.findByText(n.error)).toBeInTheDocument();
    expect(screen.queryByText(n.success)).not.toBeInTheDocument();
  });

  it("shows the sending label while pending", async () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    render(<NewsletterSignup dict={en} locale="en" tone="dark" />);
    await userEvent.type(screen.getByLabelText(n.placeholder), "jane@acme.co");
    await userEvent.click(screen.getByRole("button", { name: n.submit }));

    expect(await screen.findByRole("button", { name: n.sending })).toBeDisabled();
  });
});

describe("SubscribedNotice", () => {
  it("renders only when ?subscribed=1 is present", async () => {
    const { unmount } = render(<SubscribedNotice message="Confirmed" />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    unmount();

    window.history.replaceState({}, "", "/?subscribed=1");
    render(<SubscribedNotice message="Confirmed" />);
    expect(await screen.findByRole("status")).toHaveTextContent("Confirmed");
  });
});
