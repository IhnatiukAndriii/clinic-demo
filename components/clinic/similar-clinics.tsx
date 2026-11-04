import { ClinicCard } from "@/components/clinic-card";
import { SectionHeader } from "@/components/ui/section-header";
import type { Clinic } from "@/lib/types";

export function SimilarClinics({ clinics }: { clinics: Clinic[] }) {
  if (clinics.length === 0) return null;
  return (
    <section aria-labelledby="similar-title" className="section-pad bg-brand-50">
      <div className="page-container">
        <SectionHeader id="similar-title" title="Similar clinics" intro="Other clinics you can compare with this one." />
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {clinics.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>
      </div>
    </section>
  );
}
