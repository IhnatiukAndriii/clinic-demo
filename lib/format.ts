import type { ClinicTreatment } from "./types";

type Price = Pick<ClinicTreatment, "price_from" | "price_to" | "currency" | "price_unit">;

const currencySymbols: Record<string, string> = { AUD: "A$", USD: "US$", EUR: "€" };

function amount(value: number): string {
  return new Intl.NumberFormat("en-AU", { maximumFractionDigits: 0 }).format(value);
}

function symbol(currency: string): string {
  return currencySymbols[currency] ?? `${currency} `;
}

export function formatPriceFrom(price: Price): string {
  const unit = price.price_unit ? ` ${price.price_unit}` : "";
  return `from ${symbol(price.currency)}${amount(price.price_from)}${unit}`;
}

export function formatPriceRange(price: Price): string {
  const from = `${symbol(price.currency)}${amount(price.price_from)}`;
  const to = price.price_to ? ` – ${symbol(price.currency)}${amount(price.price_to)}` : "";
  const unit = price.price_unit ? ` ${price.price_unit}` : "";
  return `${from}${to}${unit}`;
}
