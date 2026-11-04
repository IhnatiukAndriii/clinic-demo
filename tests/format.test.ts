import { describe, expect, it } from "vitest";
import { formatPriceFrom, formatPriceRange } from "@/lib/format";

const price = {
  price_from: 1200,
  price_to: 1800,
  currency: "AUD" as const,
  price_unit: "per implant",
  inclusions: [],
};

describe("price formatting", () => {
  it("formats the from-price with unit", () => {
    expect(formatPriceFrom(price)).toBe("from A$1,200 per implant");
  });

  it("formats a range", () => {
    expect(formatPriceRange(price)).toBe("A$1,200 – A$1,800 per implant");
  });

  it("omits the upper bound when absent", () => {
    expect(formatPriceRange({ ...price, price_to: null })).toBe("A$1,200 per implant");
  });
});

describe("price parts", () => {
  it("separates the figure from the unit", async () => {
    const { priceParts } = await import("@/lib/format");
    expect(priceParts(price)).toEqual({ amount: "A$1,200", unit: "per implant" });
  });
});
