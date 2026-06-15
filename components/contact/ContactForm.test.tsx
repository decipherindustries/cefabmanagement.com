import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";
import { en } from "@/content/en";

describe("ContactForm", () => {
  it("shows validation errors and does not show success on empty submit", async () => {
    render(<ContactForm dict={en} />);
    await userEvent.click(screen.getByRole("button", { name: en.contact.send }));
    expect(screen.queryByText(en.contact.success)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("aria-invalid", "true");
  });

  it("shows success state on a valid submit (no network)", async () => {
    render(<ContactForm dict={en} />);
    await userEvent.type(screen.getByLabelText(/name/i), "Jane");
    await userEvent.type(screen.getByLabelText(/email/i), "jane@acme.co");
    await userEvent.type(screen.getByLabelText(/phone/i), "+31 6 12345678");
    await userEvent.type(screen.getByLabelText(/message/i), "Hello");
    await userEvent.click(screen.getByRole("button", { name: en.contact.send }));
    expect(await screen.findByText(en.contact.success)).toBeInTheDocument();
  });
});
