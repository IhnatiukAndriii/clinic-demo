"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { formatPriceFrom } from "@/lib/format";
import { listClinics, useDemoData } from "@/lib/store";
import { findTier } from "@/lib/tiers";
import type { ClinicTreatment } from "@/lib/types";

const head = "whitespace-nowrap bg-brand-900 px-4 py-3 text-left font-semibold text-white";
const cell = "px-4 py-4 align-top";

function price(tier: ClinicTreatment | undefined): string {
  return tier ? formatPriceFrom(tier) : "Ask for a quote";
}

export function ComparisonTable() {
  const clinics = listClinics(useDemoData(), { publishedOnly: true });

  return (
    <section id="compare" aria-labelledby="compare-title" className="section-pad scroll-mt-4">
      <div className="page-container">
        <SectionHeader
          id="compare-title"
          title="Compare clinics side by side"
          intro="Prices are starting points in Australian dollars. The quote you receive confirms what applies to you."
        />
        {clinics.length === 0 ? (
          <p className="mt-10 rounded-card bg-white p-8 shadow-card">
            No clinics are listed yet. Check back soon.
          </p>
        ) : (
          <div
            tabIndex={0}
            role="region"
            aria-label="Clinic comparison table, scrolls sideways on small screens"
            className="mt-10 max-h-[36rem] overflow-auto rounded-card bg-white shadow-card"
          >
            <table className="w-full min-w-[60rem] border-separate border-spacing-0 text-left">
              <thead className="sticky top-0 z-20">
                <tr>
                  <th scope="col" className={`${head} sticky left-0 z-10`}>Clinic</th>
                  <th scope="col" className={head}>City</th>
                  <th scope="col" className={head}>Languages</th>
                  <th scope="col" className={head}>Experience</th>
                  <th scope="col" className={head}>Single implant</th>
                  <th scope="col" className={head}>Full arch</th>
                  <th scope="col" className={head}>Top inclusions</th>
                  <th scope="col" className={head}>
                    <span className="sr-only">Quote</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((clinic) => {
                  const single = findTier(clinic, "single");
                  return (
                    <tr key={clinic.id} className="group">
                      <th
                        scope="row"
                        className={`${cell} sticky left-0 z-10 border-t border-sand-200 bg-white font-display text-title font-semibold`}
                      >
                        <Link
                          href={`/clinics/${clinic.slug}`}
                          className="text-brand-900 transition-colors duration-150 hover:text-brand-500"
                        >
                          {clinic.name}
                        </Link>
                      </th>
                      <td className={`${cell} border-t border-sand-200`}>{clinic.city}</td>
                      <td className={`${cell} border-t border-sand-200`}>{clinic.languages.join(", ") || "Ask the clinic"}</td>
                      <td className={`${cell} whitespace-nowrap border-t border-sand-200`}>
                        {clinic.years_experience ? `${clinic.years_experience} years` : "Ask the clinic"}
                      </td>
                      <td className={`${cell} border-t border-sand-200 font-semibold text-brand-900`}>{price(single)}</td>
                      <td className={`${cell} border-t border-sand-200`}>{price(findTier(clinic, "full-arch"))}</td>
                      <td className={`${cell} border-t border-sand-200`}>
                        {(single?.inclusions ?? []).slice(0, 3).join(", ") || "Ask the clinic"}
                      </td>
                      <td className={`${cell} border-t border-sand-200`}>
                        <Button href={`/clinics/${clinic.slug}#enquiry`} size="sm" className="whitespace-nowrap">
                          Get a free quote
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
