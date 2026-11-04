import { describe, expect, it } from "vitest";
import { parseEnquiry } from "@/lib/enquiry";

const id = "3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b";

function form(overrides: Record<string, string> = {}): FormData {
  const data = new FormData();
  const base: Record<string, string> = {
    clinicId: id,
    treatmentId: id,
    name: "Alex Doe",
    email: "alex@example.com",
    phone: "",
    channel: "whatsapp",
    message: "I would like a quote for two implants.",
  };
  for (const [key, value] of Object.entries({ ...base, ...overrides })) data.set(key, value);
  return data;
}

describe("parseEnquiry", () => {
  it("accepts a valid enquiry with no phone", () => {
    const result = parseEnquiry(form());
    expect(result.ok).toBe(true);
  });

  it("rejects an invalid email with a helpful message", () => {
    const result = parseEnquiry(form({ email: "nope" }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toContain("valid email");
  });

  it("rejects an unknown channel and a short message", () => {
    const result = parseEnquiry(form({ channel: "fax", message: "hi" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.channel).toBeDefined();
      expect(result.errors.message).toBeDefined();
    }
  });

  it("rejects a malformed clinic id", () => {
    const result = parseEnquiry(form({ clinicId: "abc" }));
    expect(result.ok).toBe(false);
  });

  it("rejects a malformed phone number when given", () => {
    const result = parseEnquiry(form({ phone: "call me" }));
    expect(result.ok).toBe(false);
  });
});
