import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a link when href is set", () => {
    render(<Button href="/en/contact">Schedule a call</Button>);
    const el = screen.getByRole("link", { name: "Schedule a call" });
    expect(el).toHaveAttribute("href", "/en/contact");
    expect(el).toHaveClass("cc-btn", "cc-btn--primary");
  });
  it("renders a button otherwise", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button", { name: "Send" })).toHaveClass("cc-btn");
  });
});
