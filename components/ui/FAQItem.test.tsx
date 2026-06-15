import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FAQItem } from "./FAQItem";

describe("FAQItem", () => {
  it("toggles open state on click", async () => {
    render(<FAQItem question="How quickly can you start?">Within two weeks.</FAQItem>);
    const btn = screen.getByRole("button", { name: /how quickly/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });
  it("respects defaultOpen", () => {
    render(<FAQItem question="Q" defaultOpen>A</FAQItem>);
    expect(screen.getByRole("button", { name: "Q" })).toHaveAttribute("aria-expanded", "true");
  });
});
