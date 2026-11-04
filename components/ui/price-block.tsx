import { priceParts } from "@/lib/format";
import type { ClinicTreatment } from "@/lib/types";

type Price = Pick<ClinicTreatment, "price_from" | "price_to" | "currency" | "price_unit">;

interface Props {
  label: string;
  price: Price | undefined;
  size?: "lead" | "secondary";
}

export function PriceBlock({ label, price, size = "lead" }: Props) {
  if (!price) {
    return (
      <div>
        <p className="text-caption text-muted">{label}</p>
        <p className="font-display text-title font-semibold text-brand-900">Ask for a quote</p>
      </div>
    );
  }
  const { amount, unit } = priceParts(price);
  if (size === "secondary") {
    return (
      <p className="text-muted">
        {label} from <span className="font-semibold text-ink">{amount}</span> {unit}
      </p>
    );
  }
  return (
    <div>
      <p className="text-caption text-muted">{label} from</p>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-display text-4xl font-semibold leading-none text-brand-900">{amount}</span>
        <span className="text-muted">{unit}</span>
      </p>
    </div>
  );
}
