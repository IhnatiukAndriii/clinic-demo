import { findTier } from "./tiers";
import type { Clinic } from "./types";

export type PriceSort = "name" | "price-asc" | "price-desc";

export interface DirectoryFacts {
  clinicCount: number;
  cityCount: number;
  currencies: string[];
}

export function listCities(clinics: Clinic[]): string[] {
  return [...new Set(clinics.map((clinic) => clinic.city))].sort((a, b) => a.localeCompare(b));
}

export function directoryFacts(clinics: Clinic[]): DirectoryFacts {
  const currencies = clinics.flatMap((clinic) => clinic.treatments.map((item) => item.currency));
  return {
    clinicCount: clinics.length,
    cityCount: listCities(clinics).length,
    currencies: [...new Set(currencies)],
  };
}

export function filterByCity(clinics: Clinic[], city: string | null): Clinic[] {
  return city ? clinics.filter((clinic) => clinic.city === city) : clinics;
}

function singlePrice(clinic: Clinic): number | null {
  return findTier(clinic, "single")?.price_from ?? null;
}

/** Clinics without a single-implant price always sort last. */
export function sortClinics(clinics: Clinic[], sort: PriceSort): Clinic[] {
  const byName = (a: Clinic, b: Clinic) => a.name.localeCompare(b.name);
  if (sort === "name") return [...clinics].sort(byName);
  const direction = sort === "price-asc" ? 1 : -1;
  return [...clinics].sort((a, b) => {
    const priceA = singlePrice(a);
    const priceB = singlePrice(b);
    if (priceA === null && priceB === null) return byName(a, b);
    if (priceA === null) return 1;
    if (priceB === null) return -1;
    return (priceA - priceB) * direction || byName(a, b);
  });
}

const STAY_PATTERN = /airport transfer|hotel night/i;

/** Number of clinics that list an airport transfer or hotel nights in any tier. */
export function countClinicsWithStay(clinics: Clinic[]): number {
  return clinics.filter((clinic) =>
    clinic.treatments.some((item) => item.inclusions.some((text) => STAY_PATTERN.test(text))),
  ).length;
}

/** Other published clinics, those in the same city first. */
export function similarClinics(clinics: Clinic[], clinic: Clinic, limit: number): Clinic[] {
  const others = clinics.filter((item) => item.id !== clinic.id && item.is_published);
  const sameCity = (item: Clinic) => (item.city === clinic.city ? 0 : 1);
  return others.sort((a, b) => sameCity(a) - sameCity(b) || a.name.localeCompare(b.name)).slice(0, limit);
}
