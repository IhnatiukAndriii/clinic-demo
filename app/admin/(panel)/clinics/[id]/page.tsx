import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ClinicForm } from "@/components/admin/clinic-form";
import { dangerButton, secondaryButton } from "@/components/admin/styles";
import { requireUser } from "@/lib/auth";
import { emptyPrice, type ClinicFormValues } from "@/lib/clinic-form";
import { photoUrl } from "@/lib/format";
import type { Clinic, ClinicPhoto, ClinicPrice } from "@/lib/types";
import { deletePhoto, movePhoto } from "../actions";

export const metadata: Metadata = { title: "Edit clinic" };

interface ClinicDetail extends Clinic {
  clinic_photos: (ClinicPhoto & { id: string })[];
  clinic_treatments: (ClinicPrice & { treatment_id: string })[];
}

export default async function EditClinicPage({
  params,
  searchParams,
}: PageProps<"/admin/clinics/[id]">) {
  const { id } = await params;
  const { saved } = await searchParams;
  const { supabase } = await requireUser();

  const [clinicResult, treatmentsResult] = await Promise.all([
    supabase
      .from("clinics")
      .select("*, clinic_photos(id, storage_path, sort_order), clinic_treatments(treatment_id, price_from, price_to, currency, price_unit, inclusions)")
      .eq("id", id)
      .maybeSingle<ClinicDetail>(),
    supabase.from("treatments").select("id, name").order("name"),
  ]);
  if (clinicResult.error) throw new Error(`Could not load clinic: ${clinicResult.error.message}`);
  if (treatmentsResult.error) throw new Error(`Could not load treatments: ${treatmentsResult.error.message}`);
  const clinic = clinicResult.data;
  if (!clinic) notFound();

  const treatments = (treatmentsResult.data ?? []) as { id: string; name: string }[];
  const prices: ClinicFormValues["prices"] = Object.fromEntries(treatments.map((t) => [t.id, emptyPrice()]));
  for (const row of clinic.clinic_treatments) {
    prices[row.treatment_id] = {
      enabled: true,
      from: String(row.price_from),
      to: row.price_to === null ? "" : String(row.price_to),
      currency: row.currency,
      unit: row.price_unit,
      inclusions: row.inclusions,
    };
  }

  const initial: ClinicFormValues = {
    name: clinic.name,
    slug: clinic.slug,
    city: clinic.city,
    country: clinic.country,
    description: clinic.description,
    years: clinic.years_experience === null ? "" : String(clinic.years_experience),
    languages: clinic.languages.join(", "),
    published: clinic.is_published,
    prices,
    newPhotos: [],
  };
  const photos = [...clinic.clinic_photos].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <main className="max-w-3xl">
      <h1 className="mb-8 font-display text-3xl font-semibold">{clinic.name}</h1>
      {saved && (
        <p role="status" className="mb-8 rounded-lg bg-accent-soft p-4 font-medium text-accent-strong">
          Clinic saved. Changes are live on the website.
        </p>
      )}
      <ClinicForm clinicId={clinic.id} treatments={treatments} initial={initial} />

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold">Current photos</h2>
        {photos.length === 0 ? (
          <p className="mt-3 text-muted">No photos yet. Add photos in the form above and save.</p>
        ) : (
          <ul className="mt-5 space-y-4">
            {photos.map((photo, index) => (
              <li key={photo.id} className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-lg">
                  <Image src={photoUrl(photo.storage_path)} alt={`Photo ${index + 1} of ${clinic.name}`}
                    fill sizes="96px" className="object-cover" />
                </div>
                <p className="mr-auto font-medium">
                  Photo {index + 1}{index === 0 ? " (main photo)" : ""}
                </p>
                <form action={movePhoto.bind(null, clinic.id, photo.id, "up")}>
                  <button type="submit" disabled={index === 0} className={secondaryButton}>Move up</button>
                </form>
                <form action={movePhoto.bind(null, clinic.id, photo.id, "down")}>
                  <button type="submit" disabled={index === photos.length - 1} className={secondaryButton}>
                    Move down
                  </button>
                </form>
                <form action={deletePhoto.bind(null, clinic.id, photo.id)}>
                  <button type="submit" className={dangerButton}>Delete</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
