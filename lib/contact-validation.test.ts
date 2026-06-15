import { describe, it, expect } from "vitest";
import { validateContact, type ContactValues } from "./contact-validation";

const base: ContactValues = { name: "", email: "", phone: "", company: "", interests: [], message: "" };

describe("validateContact", () => {
  it("flags required fields", () => {
    const e = validateContact(base);
    expect(e.name).toBeTruthy();
    expect(e.email).toBeTruthy();
    expect(e.phone).toBeTruthy();
    expect(e.message).toBeTruthy();
    expect(e.company).toBeUndefined();
  });
  it("flags malformed email", () => {
    expect(validateContact({ ...base, email: "nope" }).email).toBeTruthy();
    expect(validateContact({ ...base, email: "a@b.co" }).email).toBeUndefined();
  });
  it("passes a complete valid form", () => {
    const e = validateContact({ name: "A", email: "a@b.co", phone: "+31 6", company: "", interests: ["Growth"], message: "Hi" });
    expect(Object.keys(e)).toHaveLength(0);
  });
});
