import Image from "next/image";
import Link from "next/link";
import type { ClinicTreatment } from "@/lib/types";
import { Badge } from "./badge";
import { Button } from "./button";
import { PriceBlock } from "./price-block";

interface Props {
  name: string;
  city: string;
  href: string;
  quoteHref: string;
  photoSrc: string | null;
  singlePrice: ClinicTreatment | undefined;
  fullArchPrice: ClinicTreatment | undefined;
  /** Shown in full; the caller decides how many. */
  inclusions: string[];
  photoSizes: string;
}

export function ClinicCard({
  name,
  city,
  href,
  quoteHref,
  photoSrc,
  singlePrice,
  fullArchPrice,
  inclusions,
  photoSizes,
}: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card transition-shadow duration-150 hover:shadow-lift">
      <Link href={href} className="relative block aspect-[3/2] bg-brand-50" aria-label={`View ${name}`}>
        {photoSrc ? (
          <Image src={photoSrc} alt={`${name} clinic`} fill sizes={photoSizes} className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-muted">Photo coming soon</span>
        )}
        <span className="absolute left-4 top-4">
          <Badge tone="onPhoto">{city}</Badge>
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <h3 className="text-title text-brand-900">
          <Link href={href} className="transition-colors duration-150 hover:text-brand-500">
            {name}
          </Link>
        </h3>
        <div className="rounded-control bg-sand-100 p-4">
          <PriceBlock label="Single implant" price={singlePrice} />
          {fullArchPrice ? (
            <div className="mt-3 border-t border-sand-300 pt-3">
              <PriceBlock label="Full arch" price={fullArchPrice} size="secondary" />
            </div>
          ) : null}
        </div>
        <ul className="space-y-2">
          {inclusions.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="font-semibold text-brand-500">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <Button href={quoteHref} className="mt-auto">
          Get a free quote
        </Button>
      </div>
    </article>
  );
}
