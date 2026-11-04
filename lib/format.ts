import type { ClinicPrice } from "./types";

const currencySymbols: Record<string, string> = { AUD: "A$", USD: "US$", EUR: "€" };

function amount(value: number): string {
  return new Intl.NumberFormat("en-AU", { maximumFractionDigits: 0 }).format(value);
}

function symbol(currency: string): string {
  return currencySymbols[currency] ?? `${currency} `;
}

export function formatPriceFrom(price: ClinicPrice): string {
  const unit = price.price_unit ? ` ${price.price_unit}` : "";
  return `from ${symbol(price.currency)}${amount(price.price_from)}${unit}`;
}

export function formatPriceRange(price: ClinicPrice): string {
  const from = `${symbol(price.currency)}${amount(price.price_from)}`;
  const to = price.price_to ? ` – ${symbol(price.currency)}${amount(price.price_to)}` : "";
  const unit = price.price_unit ? ` ${price.price_unit}` : "";
  return `${from}${to}${unit}`;
}

export function photoUrl(storagePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/clinic-photos/${storagePath}`;
}
