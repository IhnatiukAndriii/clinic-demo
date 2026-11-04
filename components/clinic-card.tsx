import { sortedPhotos } from "@/lib/store";
import { findTier } from "@/lib/tiers";
import type { Clinic } from "@/lib/types";
import { ClinicCard as ClinicCardView } from "./ui/clinic-card";

export function ClinicCard({ clinic, wide = false }: { clinic: Clinic; wide?: boolean }) {
  const single = findTier(clinic, "single");
  const profile = `/clinics/${clinic.slug}`;
  return (
    <ClinicCardView
      name={clinic.name}
      city={clinic.city}
      href={profile}
      quoteHref={`${profile}#enquiry`}
      photoSrc={sortedPhotos(clinic)[0]?.src ?? null}
      singlePrice={single}
      fullArchPrice={findTier(clinic, "full-arch")}
      inclusions={(single?.inclusions ?? []).slice(0, 3)}
      languages={clinic.languages}
      wide={wide}
      photoSizes={wide ? "(min-width: 768px) 576px, 100vw" : "(min-width: 1152px) 560px, (min-width: 768px) 50vw, 100vw"}
    />
  );
}
