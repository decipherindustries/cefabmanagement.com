import { describe, it, expect } from "vitest";
import { renderContactEmail, escapeHtml } from "./contact-email";

const base = {
  name: "Jane Doe",
  email: "jane@acme.co",
  phone: "+31 6 12345678",
  company: "Acme",
  interests: ["Growth"],
  message: "Hello there",
};

describe("escapeHtml", () => {
  it("escapes HTML-significant characters", () => {
    expect(escapeHtml(`<a href="x">&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;",
    );
  });
});

describe("renderContactEmail", () => {
  it("includes the escaped name, message and a subject with the name", () => {
    const { subject, html, text } = renderContactEmail(base);
    expect(subject).toBe("New contact enquiry — Jane Doe");
    expect(html).toContain("Jane Doe");
    expect(html).toContain("Hello there");
    expect(text).toContain("Jane Doe");
    expect(text).toContain("Hello there");
  });

  it("strips newlines from the name in the subject", () => {
    const { subject } = renderContactEmail({ ...base, name: "Jane\nDoe" });
    expect(subject).toBe("New contact enquiry — Jane Doe");
  });

  it("escapes an injected <script> in a field", () => {
    const { html } = renderContactEmail({
      ...base,
      message: '<script>alert("xss")</script>',
    });
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>alert");
  });

  it("renders an em dash for empty interests", () => {
    const { html, text } = renderContactEmail({ ...base, interests: [] });
    expect(text).toContain("Interests: —");
    expect(html).toContain("—");
  });
});
