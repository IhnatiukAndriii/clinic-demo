import { describe, expect, it } from "vitest";
import { emptyPrice, readClinicForm, slugify, validateClinic } from "@/lib/clinic-form";

const treatmentId = "t1";

function form(entries: Record<string, string | string[]>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    for (const v of Array.isArray(value) ? value : [value]) data.append(key, v);
  }
  return data;
}

const valid = {
  name: "Saigon Smile",
  slug: "",
  city: "Ho Chi Minh City",
  country: "Vietnam",
  description: "A calm boutique implant practice in District 1.",
  years: "10",
  languages: "English, Vietnamese",
  published: "on",
  "price:t1:enabled": "on",
  "price:t1:from": "1200",
  "price:t1:to": "1800",
  "price:t1:currency": "aud",
  "price:t1:unit": "per implant",
  "price:t1:inclusion": ["CT scan", " ", "Crown"],
};

describe("slugify", () => {
  it("strips diacritics and punctuation", () => {
    expect(slugify("Đà Nẵng Bay Clinic!")).toBe("da-nang-bay-clinic");
  });
});

describe("validateClinic", () => {
  it("accepts a valid clinic and derives the slug", () => {
    const result = validateClinic(readClinicForm(form(valid), [treatmentId]));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.input.slug).toBe("saigon-smile");
      expect(result.input.languages).toEqual(["English", "Vietnamese"]);
      expect(result.input.prices[0]).toMatchObject({ priceFrom: 1200, priceTo: 1800, currency: "AUD" });
      expect(result.input.prices[0].inclusions).toEqual(["CT scan", "Crown"]);
    }
  });

  it("rejects a price range where the top is below the start", () => {
    const result = validateClinic(readClinicForm(form({ ...valid, "price:t1:to": "100" }), [treatmentId]));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors["price:t1"]).toBeDefined();
  });

  it("refuses to publish without a price", () => {
    const result = validateClinic(readClinicForm(form({ ...valid, "price:t1:enabled": "" }), [treatmentId]));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.published).toBeDefined();
  });

  it("allows an unpublished draft without prices", () => {
    const draft = { ...valid, published: "", "price:t1:enabled": "" };
    const result = validateClinic(readClinicForm(form(draft), [treatmentId]));
    expect(result.ok).toBe(true);
  });

  it("reports missing required fields", () => {
    const result = validateClinic({
      name: "", slug: "", city: "", country: "", description: "", years: "", languages: "",
      published: false, prices: { t1: emptyPrice() }, newPhotos: [],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors)).toEqual(
      expect.arrayContaining(["name", "city", "country", "description"]),
    );
  });
});
