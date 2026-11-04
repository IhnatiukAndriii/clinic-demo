"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { formatPriceFrom } from "@/lib/format";
import { listClinics, useDemoData } from "@/lib/store";
import { findTier } from "@/lib/tiers";
import type { Clinic, ClinicTreatment } from "@/lib/types";

const head = "bg-brand-900 px-4 py-3 text-left font-semibold text-white";
const cell = "border-t border-sand-200 px-4 py-4 align-middle";
const nameClass =
  "line-clamp-2 font-sans text-lg font-semibold leading-snug text-brand-900 transition-colors duration-150 hover:text-brand-500";
const COLUMN_WIDTHS = ["26%", "16%", "12%", "15%", "15%", "16%"];
const ASK = "Ask the clinic";

function price(tier: ClinicTreatment | undefined): string {
  return tier ? formatPriceFrom(tier) : "Ask for a quote";
}

function experience(clinic: Clinic): string {
  return clinic.years_experience ? `${clinic.years_experience} years` : ASK;
}

function languages(clinic: Clinic): string {
  return clinic.languages.join(", ") || ASK;
}

function ClinicName({ clinic }: { clinic: Clinic }) {
  return (
    <Link href={`/clinics/${clinic.slug}`} className={nameClass}>
      {clinic.name}
    </Link>
  );
}

function QuoteButton({ clinic }: { clinic: Clinic }) {
  return (
    <Button href={`/clinics/${clinic.slug}#enquiry`} size="sm" className="whitespace-nowrap">
      Get a free quote
    </Button>
  );
}

function DesktopTable({ clinics }: { clinics: Clinic[] }) {
  return (
    <div className="mt-10 hidden overflow-hidden rounded-card bg-white shadow-card md:block">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">Clinic comparison</caption>
        <colgroup>
          {COLUMN_WIDTHS.map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={head}>Clinic</th>
            <th scope="col" className={head}>Languages</th>
            <th scope="col" className={head}>Experience</th>
            <th scope="col" className={head}>Single implant from</th>
            <th scope="col" className={head}>Full arch from</th>
            <th scope="col" className={head}><span className="sr-only">Quote</span></th>
          </tr>
        </thead>
        <tbody>
          {clinics.map((clinic) => (
            <tr key={clinic.id}>
              <th scope="row" className={`${cell} text-left`}>
                <ClinicName clinic={clinic} />
                <span className="mt-1 block text-sm font-normal text-muted">{clinic.city}</span>
              </th>
              <td className={cell}>{languages(clinic)}</td>
              <td className={cell}>{experience(clinic)}</td>
              <td className={`${cell} font-semibold text-brand-900`}>{price(findTier(clinic, "single"))}</td>
              <td className={cell}>{price(findTier(clinic, "full-arch"))}</td>
              <td className={cell}><QuoteButton clinic={clinic} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-t border-sand-200 py-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function MobileCards({ clinics }: { clinics: Clinic[] }) {
  return (
    <ul className="mt-10 space-y-4 md:hidden">
      {clinics.map((clinic) => (
        <li key={clinic.id} className="rounded-card bg-white p-5 shadow-card">
          <ClinicName clinic={clinic} />
          <p className="mt-1 text-sm text-muted">{clinic.city}</p>
          <dl className="mt-4">
            <Fact label="Languages" value={languages(clinic)} />
            <Fact label="Experience" value={experience(clinic)} />
            <Fact label="Single implant from" value={price(findTier(clinic, "single"))} />
            <Fact label="Full arch from" value={price(findTier(clinic, "full-arch"))} />
          </dl>
          <div className="mt-2"><QuoteButton clinic={clinic} /></div>
        </li>
      ))}
    </ul>
  );
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
          <>
            <DesktopTable clinics={clinics} />
            <MobileCards clinics={clinics} />
          </>
        )}
      </div>
    </section>
  );
}
