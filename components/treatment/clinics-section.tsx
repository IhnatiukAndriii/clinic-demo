"use client";

import { useState } from "react";
import { ClinicCard } from "@/components/clinic-card";
import { SectionHeader } from "@/components/ui/section-header";
import { filterByCity, listCities, sortClinics, type PriceSort } from "@/lib/directory";
import { listClinics, useDemoData } from "@/lib/store";

const SORT_OPTIONS: { value: PriceSort; label: string }[] = [
  { value: "name", label: "Clinic name" },
  { value: "price-asc", label: "Single implant price, low to high" },
  { value: "price-desc", label: "Single implant price, high to low" },
];

function chipClass(active: boolean): string {
  const base =
    "rounded-full border-2 px-5 py-2 font-semibold transition-colors duration-150";
  return active
    ? `${base} border-brand-600 bg-brand-600 text-white`
    : `${base} border-brand-200 bg-white text-brand-700 hover:border-brand-500`;
}

export function ClinicsSection() {
  const published = listClinics(useDemoData(), { publishedOnly: true });
  const [city, setCity] = useState<string | null>(null);
  const [sort, setSort] = useState<PriceSort>("name");

  const cities = listCities(published);
  const activeCity = city && cities.includes(city) ? city : null;
  const visible = sortClinics(filterByCity(published, activeCity), sort);
  // An odd last card would sit alone in a two-column grid, so it spans both.
  const spanLast = visible.length > 1 && visible.length % 2 === 1;

  return (
    <section id="clinics" aria-labelledby="clinics-title" className="section-pad scroll-mt-4 bg-brand-50">
      <div className="page-container">
        <SectionHeader
          id="clinics-title"
          title="Choose a clinic and ask for your free quote"
          intro="Each card shows the starting price for a single implant and for a full arch, plus what is included."
        />
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Filter by city" className="flex flex-wrap gap-3">
            <button type="button" aria-pressed={activeCity === null} className={chipClass(activeCity === null)} onClick={() => setCity(null)}>
              All cities
            </button>
            {cities.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={activeCity === name}
                className={chipClass(activeCity === name)}
                onClick={() => setCity(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 font-semibold text-ink">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as PriceSort)}
              className="h-12 rounded-control border-2 border-brand-200 bg-white px-3 font-normal"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p role="status" className="mt-6 text-muted">
          Showing {visible.length} of {published.length} clinics
        </p>
        {visible.length === 0 ? (
          <p className="mt-6 rounded-card bg-white p-8 shadow-card">
            No clinics match this filter. Choose All cities to see every clinic.
          </p>
        ) : (
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {visible.map((clinic, index) => {
              const wide = spanLast && index === visible.length - 1;
              return (
                <div key={clinic.id} className={wide ? "md:col-span-2" : ""}>
                  <ClinicCard clinic={clinic} wide={wide} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
