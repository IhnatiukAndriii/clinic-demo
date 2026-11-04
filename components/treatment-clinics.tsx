"use client";

import { listClinics, useDemoData } from "@/lib/store";
import { ClinicCard } from "./clinic-card";

export function TreatmentClinics() {
  const clinics = listClinics(useDemoData(), { publishedOnly: true });

  if (clinics.length === 0) {
    return (
      <p className="mt-16 rounded-2xl border border-line bg-surface p-8">
        No clinics are listed for this treatment yet. Check back soon.
      </p>
    );
  }
  return (
    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {clinics.map((clinic) => (
        <ClinicCard key={clinic.id} clinic={clinic} />
      ))}
    </div>
  );
}
