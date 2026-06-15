import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";
import { en } from "@/content/en";

function mockFetch(ok: boolean, json: Record<string, unknown>) {
  const fn = vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(json) });
  vi.stubGlobal("fetch", fn);
  return fn;
}

async function fillValid() {
  await userEvent.type(screen.getByLabelText(/name/i), "Jane");
  await userEvent.type(screen.getByLabelText(/email/i), "jane@acme.co");
  await userEvent.type(screen.getByLabelText(/phone/i), "+31 6 12345678");
  await userEvent.type(screen.getByLabelText(/message/i), "Hello");
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows validation errors and does not show success on empty submit", async () => {
    const fetchFn = mockFetch(true, { ok: true });
    render(<ContactForm dict={en} />);
    await userEvent.click(screen.getByRole("button", { name: en.contact.send }));
    expect(screen.queryByText(en.contact.success)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("aria-invalid", "true");
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("posts to /api/contact and shows success on a valid submit", async () => {
    const fetchFn = mockFetch(true, { ok: true });
    render(<ContactForm dict={en} />);
    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: en.contact.send }));

    expect(await screen.findByText(en.contact.success)).toBeInTheDocument();
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body as string);
    expect(body.name).toBe("Jane");
    expect(body.email).toBe("jane@acme.co");
    expect(body).toHaveProperty("company_url", "");
  });

  it("shows the error message and not the success card when the server returns ok: false", async () => {
    mockFetch(false, { ok: false, error: "send-failed" });
    render(<ContactForm dict={en} />);
    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: en.contact.send }));

    expect(await screen.findByText(en.contact.error)).toBeInTheDocument();
    expect(screen.queryByText(en.contact.success)).not.toBeInTheDocument();
  });
});
