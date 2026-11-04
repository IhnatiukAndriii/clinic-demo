import { TIERS, TIER_LABELS } from "./tiers";
import type { Tier } from "./types";

export interface PriceValues {
  enabled: boolean;
  from: string;
  to: string;
  unit: string;
  inclusions: string[];
}

export interface ClinicFormValues {
  name: string;
  slug: string;
  city: string;
  country: string;
  description: string;
  years: string;
  languages: string;
  published: boolean;
  prices: Record<Tier, PriceValues>;
  newPhotos: string[];
}

export interface PriceInput {
  tier: Tier;
  priceFrom: number;
  priceTo: number | null;
  unit: string;
  inclusions: string[];
}

export interface ClinicInput {
  name: string;
  slug: string;
  city: string;
  country: string;
  description: string;
  yearsExperience: number | null;
  languages: string[];
  isPublished: boolean;
  prices: PriceInput[];
  newPhotos: string[];
}

export type ClinicErrors = Record<string, string>;

export type ClinicParseResult =
  | { ok: true; input: ClinicInput }
  | { ok: false; errors: ClinicErrors };

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

const DEFAULT_UNITS: Record<Tier, string> = { single: "per implant", "full-arch": "per jaw" };

export function emptyPrice(tier: Tier): PriceValues {
  return { enabled: false, from: "", to: "", unit: DEFAULT_UNITS[tier], inclusions: [] };
}

export function readClinicForm(form: FormData): ClinicFormValues {
  const prices = {} as Record<Tier, PriceValues>;
  for (const tier of TIERS) {
    prices[tier] = {
      enabled: form.get(`price:${tier}:enabled`) === "on",
      from: text(form, `price:${tier}:from`),
      to: text(form, `price:${tier}:to`),
      unit: text(form, `price:${tier}:unit`),
      inclusions: form
        .getAll(`price:${tier}:inclusion`)
        .filter((v): v is string => typeof v === "string")
        .map((v) => v.trim())
        .filter(Boolean),
    };
  }
  return {
    name: text(form, "name"),
    slug: text(form, "slug"),
    city: text(form, "city"),
    country: text(form, "country"),
    description: text(form, "description"),
    years: text(form, "years"),
    languages: text(form, "languages"),
    published: form.get("published") === "on",
    prices,
    newPhotos: form
      .getAll("newPhoto")
      .filter((v): v is string => typeof v === "string" && v.length > 0),
  };
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function validatePrice(tier: Tier, price: PriceValues, errors: ClinicErrors): PriceInput | null {
  const key = `price:${tier}`;
  const from = Number(price.from);
  const to = price.to === "" ? null : Number(price.to);
  if (price.from === "" || !Number.isFinite(from) || from < 0) {
    errors[key] = "Enter the starting price as a number, for example 1200.";
    return null;
  }
  if (to !== null && (!Number.isFinite(to) || to < from)) {
    errors[key] = "The highest price must be a number equal to or above the starting price.";
    return null;
  }
  if (price.unit.length > 40) {
    errors[key] = "Use 40 characters or fewer for the price unit.";
    return null;
  }
  return {
    tier,
    priceFrom: from,
    priceTo: to,
    unit: price.unit,
    inclusions: price.inclusions,
  };
}

export function validateClinic(values: ClinicFormValues): ClinicParseResult {
  const errors: ClinicErrors = {};
  const slug = values.slug || slugify(values.name);

  if (values.name.length < 2 || values.name.length > 120) errors.name = "Enter the clinic name (2 to 120 characters).";
  if (!values.city) errors.city = "Enter the city.";
  if (!values.country) errors.country = "Enter the country.";
  if (values.description.length < 20) errors.description = "Write a short description of at least 20 characters.";
  if (!SLUG.test(slug)) errors.slug = "Use only lowercase letters, numbers and single hyphens, for example saigon-smile.";

  let yearsExperience: number | null = null;
  if (values.years !== "") {
    yearsExperience = Number(values.years);
    if (!Number.isInteger(yearsExperience) || yearsExperience < 0 || yearsExperience > 80) {
      errors.years = "Enter whole years between 0 and 80, or leave this empty.";
    }
  }

  const prices: PriceInput[] = [];
  for (const tier of TIERS) {
    const price = values.prices[tier];
    if (!price.enabled) continue;
    const parsed = validatePrice(tier, price, errors);
    if (parsed) prices.push(parsed);
  }
  const missing = TIERS.filter((tier) => !values.prices[tier].enabled);
  if (values.published && missing.length > 0 && !Object.keys(errors).some((k) => k.startsWith("price:"))) {
    errors.published = `Add a price for ${missing.map((tier) => TIER_LABELS[tier].toLowerCase()).join(" and ")} before publishing, so visitors can compare clinics.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    input: {
      name: values.name,
      slug,
      city: values.city,
      country: values.country,
      description: values.description,
      yearsExperience,
      languages: values.languages.split(",").map((l) => l.trim()).filter(Boolean),
      isPublished: values.published,
      prices,
      newPhotos: values.newPhotos,
    },
  };
}
