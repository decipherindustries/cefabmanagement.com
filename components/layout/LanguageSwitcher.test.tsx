import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageSwitcher } from "./LanguageSwitcher";

vi.mock("next/navigation", () => ({ usePathname: () => "/en/about" }));

describe("LanguageSwitcher", () => {
  it("links to the other locale's equivalent page", () => {
    render(<LanguageSwitcher locale="en" />);
    const link = screen.getByRole("link", { name: /nl/i });
    expect(link).toHaveAttribute("href", "/nl/over-mij");
  });
});
