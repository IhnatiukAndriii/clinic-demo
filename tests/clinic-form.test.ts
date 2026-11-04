import { describe, expect, it } from "vitest";
import { emptyPrice, readClinicForm, slugify, validateClinic } from "@/lib/clinic-form";

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
  "price:single:enabled": "on",
  "price:single:from": "1200",
  "price:single:to": "1800",
  "price:single:unit": "per implant",
  "price:single:inclusion": ["CT scan", " ", "Crown"],
  "price:full-arch:enabled": "on",
  "price:full-arch:from": "9500",
  "price:full-arch:unit": "per jaw",
};

describe("slugify", () => {
  it("strips diacritics and punctuation", () => {
    expect(slugify("Đà Nẵng Bay Clinic!")).toBe("da-nang-bay-clinic");
  });
});

describe("validateClinic", () => {
  it("accepts a valid clinic and derives the slug", () => {
    const result = validateClinic(readClinicForm(form(valid)));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.input.slug).toBe("saigon-smile");
      expect(result.input.languages).toEqual(["English", "Vietnamese"]);
      expect(result.input.prices[0]).toMatchObject({ tier: "single", priceFrom: 1200, priceTo: 1800 });
      expect(result.input.prices[1]).toMatchObject({ tier: "full-arch", priceFrom: 9500, priceTo: null });
      expect(result.input.prices[0].inclusions).toEqual(["CT scan", "Crown"]);
    }
  });

  it("rejects a price range where the top is below the start", () => {
    const result = validateClinic(readClinicForm(form({ ...valid, "price:single:to": "100" })));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors["price:single"]).toBeDefined();
  });

  it("refuses to publish without both prices", () => {
    const result = validateClinic(readClinicForm(form({ ...valid, "price:full-arch:enabled": "" })));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.published).toBeDefined();
  });

  it("allows an unpublished draft without prices", () => {
    const draft = { ...valid, published: "", "price:single:enabled": "", "price:full-arch:enabled": "" };
    const result = validateClinic(readClinicForm(form(draft)));
    expect(result.ok).toBe(true);
  });

  it("reports missing required fields", () => {
    const result = validateClinic({
      name: "", slug: "", city: "", country: "", description: "", years: "", languages: "",
      published: false, prices: { single: emptyPrice("single"), "full-arch": emptyPrice("full-arch") }, newPhotos: [],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors)).toEqual(
      expect.arrayContaining(["name", "city", "country", "description"]),
    );
  });
});
