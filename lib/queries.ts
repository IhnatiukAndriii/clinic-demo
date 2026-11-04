import { createPublicClient } from "./supabase/public";
import type {
  ClinicCardData,
  ClinicPhoto,
  ClinicPrice,
  ClinicProfile,
  Clinic,
  Treatment,
} from "./types";

const bySortOrder = (a: ClinicPhoto, b: ClinicPhoto) => a.sort_order - b.sort_order;

export async function getTreatment(slug: string): Promise<Treatment | null> {
  const { data, error } = await createPublicClient()
    .from("treatments")
    .select("id, slug, name, summary, body")
    .eq("slug", slug)
    .maybeSingle<Treatment>();
  if (error) throw new Error(`Could not load treatment: ${error.message}`);
  return data;
}

interface CardRow extends Clinic {
  clinic_photos: ClinicPhoto[];
  clinic_treatments: ClinicPrice[];
}

export async function getClinicsForTreatment(treatmentId: string): Promise<ClinicCardData[]> {
  const { data, error } = await createPublicClient()
    .from("clinics")
    .select(
      "*, clinic_photos(storage_path, sort_order), clinic_treatments!inner(price_from, price_to, currency, price_unit, inclusions)",
    )
    .eq("clinic_treatments.treatment_id", treatmentId)
    .order("name")
    .returns<CardRow[]>();
  if (error) throw new Error(`Could not load clinics: ${error.message}`);

  return (data ?? []).map(({ clinic_photos, clinic_treatments, ...clinic }) => ({
    ...clinic,
    ...clinic_treatments[0],
    photos: [...clinic_photos].sort(bySortOrder),
  }));
}

interface ProfileRow extends Clinic {
  clinic_photos: ClinicPhoto[];
  clinic_treatments: (ClinicPrice & { treatments: { id: string; slug: string; name: string } })[];
}

export async function getClinicProfile(slug: string): Promise<ClinicProfile | null> {
  const { data, error } = await createPublicClient()
    .from("clinics")
    .select(
      "*, clinic_photos(storage_path, sort_order), clinic_treatments(price_from, price_to, currency, price_unit, inclusions, treatments(id, slug, name))",
    )
    .eq("slug", slug)
    .maybeSingle<ProfileRow>();
  if (error) throw new Error(`Could not load clinic: ${error.message}`);
  if (!data) return null;

  const { clinic_photos, clinic_treatments, ...clinic } = data;
  return {
    ...clinic,
    photos: [...clinic_photos].sort(bySortOrder),
    treatments: clinic_treatments.map(({ treatments, ...price }) => ({
      ...price,
      treatment: treatments,
    })),
  };
}
