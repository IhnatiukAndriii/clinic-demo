export interface PriceValues {
  enabled: boolean;
  from: string;
  to: string;
  currency: string;
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
  prices: Record<string, PriceValues>;
  newPhotos: string[];
}

export interface PriceInput {
  treatmentId: string;
  priceFrom: number;
  priceTo: number | null;
  currency: string;
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

export function emptyPrice(): PriceValues {
  return { enabled: false, from: "", to: "", currency: "AUD", unit: "", inclusions: [] };
}

export function readClinicForm(form: FormData, treatmentIds: string[]): ClinicFormValues {
  const prices: Record<string, PriceValues> = {};
  for (const id of treatmentIds) {
    prices[id] = {
      enabled: form.get(`price:${id}:enabled`) === "on",
      from: text(form, `price:${id}:from`),
      to: text(form, `price:${id}:to`),
      currency: text(form, `price:${id}:currency`).toUpperCase() || "AUD",
      unit: text(form, `price:${id}:unit`),
      inclusions: form
        .getAll(`price:${id}:inclusion`)
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

function validatePrice(treatmentId: string, price: PriceValues, errors: ClinicErrors): PriceInput | null {
  const key = `price:${treatmentId}`;
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
  if (!/^[A-Z]{3}$/.test(price.currency)) {
    errors[key] = "Use a three-letter currency code, for example AUD.";
    return null;
  }
  if (price.unit.length > 40) {
    errors[key] = "Use 40 characters or fewer for the price unit.";
    return null;
  }
  return {
    treatmentId,
    priceFrom: from,
    priceTo: to,
    currency: price.currency,
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
  for (const [treatmentId, price] of Object.entries(values.prices)) {
    if (!price.enabled) continue;
    const parsed = validatePrice(treatmentId, price, errors);
    if (parsed) prices.push(parsed);
  }
  if (values.published && prices.length === 0 && !Object.keys(errors).some((k) => k.startsWith("price:"))) {
    errors.published = "Add at least one price before publishing, so visitors can request a quote.";
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
