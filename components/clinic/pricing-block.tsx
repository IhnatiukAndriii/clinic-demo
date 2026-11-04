import { SectionHeader } from "@/components/ui/section-header";
import { formatPriceRange } from "@/lib/format";
import { TIER_LABELS } from "@/lib/tiers";
import type { ClinicTreatment } from "@/lib/types";

export function PricingBlock({ treatments }: { treatments: ClinicTreatment[] }) {
  return (
    <section aria-labelledby="pricing-title">
      <SectionHeader
        id="pricing-title"
        title="Treatments and prices"
        intro="Prices are in Australian dollars. Your written quote confirms what applies to you."
      />
      {treatments.length === 0 ? (
        <p className="mt-8 rounded-card bg-white p-6 shadow-card">This clinic has not listed prices yet. Ask for a quote.</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {treatments.map((item) => (
            <div key={item.tier} className="rounded-card bg-white p-6 shadow-card">
              <h3 className="text-title text-brand-900">{TIER_LABELS[item.tier]}</h3>
              <p className="mt-3 font-display text-3xl font-semibold text-brand-900">
                {formatPriceRange({ ...item, price_unit: "" })}
              </p>
              <p className="text-muted">{item.price_unit}</p>
              {item.inclusions.length > 0 ? (
                <>
                  <p className="mt-5 font-semibold">Included in the price</p>
                  <ul className="mt-2 space-y-2">
                    {item.inclusions.map((inclusion) => (
                      <li key={inclusion} className="flex gap-2">
                        <span aria-hidden className="font-semibold text-brand-500">✓</span>
                        {inclusion}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
