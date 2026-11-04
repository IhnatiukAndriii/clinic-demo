import type { Clinic, ClinicTreatment, Tier } from "./types";

export const TIERS: readonly Tier[] = ["single", "full-arch"];

export const TIER_LABELS: Record<Tier, string> = {
  single: "Single implant",
  "full-arch": "Full arch (All-on-4)",
};

export function findTier(clinic: Clinic, tier: Tier): ClinicTreatment | undefined {
  return clinic.treatments.find((item) => item.tier === tier);
}
