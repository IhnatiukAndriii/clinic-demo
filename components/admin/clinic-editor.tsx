"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { emptyPrice, type ClinicFormValues } from "@/lib/clinic-form";
import { deletePhoto, getClinic, movePhoto, sortedPhotos, StoreError, useDemoData } from "@/lib/store";
import { findTier, TIERS } from "@/lib/tiers";
import type { Clinic } from "@/lib/types";
import { ClinicForm } from "./clinic-form";
import { dangerButton, secondaryButton } from "./styles";

function blankValues(): ClinicFormValues {
  return {
    name: "",
    slug: "",
    city: "",
    country: "Vietnam",
    description: "",
    years: "",
    languages: "",
    published: false,
    prices: { single: emptyPrice("single"), "full-arch": emptyPrice("full-arch") },
    newPhotos: [],
  };
}

function valuesFromClinic(clinic: Clinic): ClinicFormValues {
  const prices = { single: emptyPrice("single"), "full-arch": emptyPrice("full-arch") };
  for (const tier of TIERS) {
    const item = findTier(clinic, tier);
    if (!item) continue;
    prices[tier] = {
      enabled: true,
      from: String(item.price_from),
      to: item.price_to === null ? "" : String(item.price_to),
      unit: item.price_unit,
      inclusions: item.inclusions,
    };
  }
  return {
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
}

function PhotoList({ clinic }: { clinic: Clinic }) {
  const [error, setError] = useState<string | null>(null);
  const photos = sortedPhotos(clinic);

  function run(action: () => void) {
    try {
      action();
      setError(null);
    } catch (caught) {
      setError(caught instanceof StoreError ? caught.message : "That change could not be saved.");
    }
  }

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-semibold">Current photos</h2>
      {error && <p role="alert" className="mt-3 text-danger">{error}</p>}
      {photos.length === 0 ? (
        <p className="mt-3 text-muted">No photos yet. Add photos in the form above and save.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {photos.map((photo, index) => (
            <li key={photo.id} className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-lg">
                <Image src={photo.src} alt={`Photo ${index + 1} of ${clinic.name}`}
                  fill sizes="96px" className="object-cover" />
              </div>
              <p className="mr-auto font-medium">
                Photo {index + 1}{index === 0 ? " (main photo)" : ""}
              </p>
              <button type="button" disabled={index === 0} className={secondaryButton}
                onClick={() => run(() => movePhoto(clinic.id, photo.id, "up"))}>
                Move up
              </button>
              <button type="button" disabled={index === photos.length - 1} className={secondaryButton}
                onClick={() => run(() => movePhoto(clinic.id, photo.id, "down"))}>
                Move down
              </button>
              <button type="button" className={dangerButton}
                onClick={() => run(() => deletePhoto(clinic.id, photo.id))}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function ClinicEditor({ clinicId, saved }: { clinicId: string | null; saved?: boolean }) {
  const data = useDemoData();

  if (!clinicId) {
    return (
      <main className="max-w-3xl">
        <h1 className="mb-8 font-display text-3xl font-semibold">Add clinic</h1>
        <ClinicForm clinicId={null} initial={blankValues()} />
      </main>
    );
  }

  const clinic = getClinic(data, clinicId);
  if (!clinic) {
    return (
      <main>
        <h1 className="font-display text-3xl font-semibold">Clinic not found</h1>
        <p className="mt-3">
          <Link href="/admin/clinics" className="text-accent hover:underline">Back to clinics</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl">
      <h1 className="mb-8 font-display text-3xl font-semibold">{clinic.name}</h1>
      <ClinicForm key={clinic.id} clinicId={clinic.id} initial={valuesFromClinic(clinic)} savedInitially={saved} />
      <PhotoList clinic={clinic} />
    </main>
  );
}
