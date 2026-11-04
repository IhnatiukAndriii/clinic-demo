import { describe, expect, it } from "vitest";
import {
  countClinicsWithStay,
  directoryFacts,
  filterByCity,
  listCities,
  sortClinics,
} from "@/lib/directory";
import { SEED_CLINICS } from "@/lib/seed";
import type { Clinic } from "@/lib/types";

const names = (clinics: Clinic[]) => clinics.map((clinic) => clinic.slug);

describe("directory helpers", () => {
  it("computes facts from the data", () => {
    expect(directoryFacts(SEED_CLINICS)).toEqual({ clinicCount: 4, cityCount: 3, currencies: ["AUD"] });
  });

  it("lists cities alphabetically", () => {
    expect(listCities(SEED_CLINICS)).toEqual(["Da Nang", "Hanoi", "Ho Chi Minh City"]);
  });

  it("filters by city and keeps everything for null", () => {
    expect(names(filterByCity(SEED_CLINICS, "Hanoi"))).toEqual(["hanoi-old-quarter-dental"]);
    expect(filterByCity(SEED_CLINICS, null)).toHaveLength(4);
  });

  it("sorts by single implant price in both directions", () => {
    expect(names(sortClinics(SEED_CLINICS, "price-asc"))).toEqual([
      "danang-bay-implant-centre",
      "lotus-dental-care",
      "saigon-smile-studio",
      "hanoi-old-quarter-dental",
    ]);
    expect(names(sortClinics(SEED_CLINICS, "price-desc"))[0]).toBe("hanoi-old-quarter-dental");
  });

  it("puts clinics without a single implant price last", () => {
    const noPrice: Clinic = { ...SEED_CLINICS[0], slug: "no-price", name: "A", treatments: [] };
    expect(sortClinics([noPrice, ...SEED_CLINICS], "price-asc").at(-1)?.slug).toBe("no-price");
    expect(sortClinics([noPrice, ...SEED_CLINICS], "price-desc").at(-1)?.slug).toBe("no-price");
  });

  it("counts clinics that list transfers or hotel nights", () => {
    expect(countClinicsWithStay(SEED_CLINICS)).toBe(3);
  });
});
