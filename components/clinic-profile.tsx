"use client";

import Link from "next/link";
import { ClinicGallery } from "@/components/clinic/clinic-gallery";
import { PricingBlock } from "@/components/clinic/pricing-block";
import { SimilarClinics } from "@/components/clinic/similar-clinics";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { similarClinics } from "@/lib/directory";
import { priceParts } from "@/lib/format";
import { getClinic, sortedPhotos, useDemoData, useHydrated } from "@/lib/store";
import { findTier } from "@/lib/tiers";
import { EnquiryForm } from "./enquiry-form";

const TREATMENT_HREF = "/treatments/dental-implants";

function NotFound({ loading }: { loading: boolean }) {
  return (
    <main className="page-container section-pad">
      <h1 className="text-heading text-brand-900">{loading ? "Loading clinic…" : "Clinic not found"}</h1>
      {!loading && (
        <p className="mt-4 text-lead text-muted">
          This clinic is not in the directory.{" "}
          <Link href={TREATMENT_HREF} className="text-brand-700 underline">
            See all dental implant clinics
          </Link>
        </p>
      )}
    </main>
  );
}

export function ClinicProfile({ slug }: { slug: string }) {
  const data = useDemoData();
  const hydrated = useHydrated();
  const clinic = getClinic(data, slug);

  if (!clinic) return <NotFound loading={!hydrated} />;

  const single = findTier(clinic, "single");
  const enquiryTreatment = clinic.treatments[0];

  return (
    <main className="pb-24 lg:pb-0">
      <div className="page-container pt-8">
        <Breadcrumb
          items={[
            { label: "Dental implants in Vietnam", href: TREATMENT_HREF },
            { label: clinic.name },
          ]}
        />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge>{clinic.city}</Badge>
          {clinic.years_experience ? <Badge tone="sand">{clinic.years_experience} years of experience</Badge> : null}
        </div>
        <h1 className="mt-4 max-w-3xl text-display">{clinic.name}</h1>
      </div>

      <div className="page-container mt-10 grid gap-12 pb-16 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-16">
        <div className="space-y-14">
          <ClinicGallery photos={sortedPhotos(clinic)} name={clinic.name} />
          <section aria-label="About the clinic" className="max-w-prose space-y-4 text-lead">
            {clinic.description.split("\n").filter(Boolean).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {clinic.languages.length > 0 && (
              <p className="text-body text-muted">
                <span className="font-semibold text-ink">Languages:</span> {clinic.languages.join(", ")}
              </p>
            )}
          </section>
          <PricingBlock treatments={clinic.treatments} />
        </div>

        <section
          id="enquiry"
          aria-labelledby="enquiry-title"
          className="scroll-mt-4 rounded-panel bg-white p-6 shadow-lift lg:sticky lg:top-6"
        >
          <h2 id="enquiry-title" className="text-title text-brand-900">Get a free quote</h2>
          <p className="mb-6 mt-2 text-muted">Tell {clinic.name} what you need. There is no obligation.</p>
          {enquiryTreatment ? (
            <EnquiryForm
              clinicId={clinic.id}
              clinicName={clinic.name}
              treatmentId={enquiryTreatment.treatment_id}
            />
          ) : (
            <p>This clinic is not taking requests yet.</p>
          )}
        </section>
      </div>

      <SimilarClinics clinics={similarClinics(data.clinics, clinic, 2)} />

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-sand-200 bg-white px-5 py-3 lg:hidden">
        <p className="whitespace-nowrap font-display text-xl font-semibold leading-tight text-brand-900">
          {single ? `from ${priceParts(single).amount}` : "Ask for a quote"}
          {single ? <span className="block font-sans text-caption font-normal text-muted">{single.price_unit}</span> : null}
        </p>
        <Button href="#enquiry" size="sm">
          Get a free quote
        </Button>
      </div>
    </main>
  );
}
