"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  readClinicForm,
  validateClinic,
  type ClinicErrors,
  type ClinicFormValues,
} from "@/lib/clinic-form";
import { createClinic, StoreError, updateClinic } from "@/lib/store";
import { TIERS } from "@/lib/tiers";
import { PhotoUploader } from "./photo-uploader";
import { PriceRow } from "./price-row";
import { inputClass, primaryButton } from "./styles";

interface Props {
  clinicId: string | null;
  initial: ClinicFormValues;
  savedInitially?: boolean;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={id} className="mt-1 text-sm text-danger">{message}</p>;
}

export function ClinicForm({ clinicId, initial, savedInitially = false }: Props) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<ClinicErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(savedInitially);
  const [saveCount, setSaveCount] = useState(0);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);
    const submitted = readClinicForm(new FormData(event.currentTarget));
    setValues(submitted);
    const parsed = validateClinic(submitted);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      setMessage("Some details need fixing. Check the highlighted fields.");
      return;
    }

    try {
      if (clinicId) {
        updateClinic(clinicId, parsed.input);
        setErrors({});
        setMessage(null);
        setValues({ ...submitted, newPhotos: [] });
        setSaveCount((count) => count + 1);
        setSaved(true);
      } else {
        const clinic = createClinic(parsed.input);
        router.push(`/admin/clinics/${clinic.id}?saved=1`);
      }
    } catch (error) {
      if (!(error instanceof StoreError)) throw error;
      setErrors(error.field ? { [error.field]: error.message } : {});
      setMessage(error.message);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
      {saved && (
        <p role="status" className="rounded-lg bg-accent-soft p-4 font-medium text-accent-strong">
          Clinic saved. Changes are live on the website.
        </p>
      )}
      {message && (
        <p role="alert" className="rounded-lg border border-danger p-4 text-danger">{message}</p>
      )}

      <section className="space-y-5">
        <h2 className="font-display text-2xl font-semibold">Clinic details</h2>
        <div>
          <label htmlFor="name" className="font-medium">Clinic name</label>
          <input id="name" name="name" defaultValue={values.name} aria-invalid={!!errors.name}
            aria-describedby="name-error" className={inputClass} />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="font-medium">City</label>
            <input id="city" name="city" defaultValue={values.city} aria-invalid={!!errors.city}
              aria-describedby="city-error" className={inputClass} />
            <FieldError id="city-error" message={errors.city} />
          </div>
          <div>
            <label htmlFor="country" className="font-medium">Country</label>
            <input id="country" name="country" defaultValue={values.country} aria-invalid={!!errors.country}
              aria-describedby="country-error" className={inputClass} />
            <FieldError id="country-error" message={errors.country} />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="font-medium">Description</label>
          <p className="text-sm text-muted">Start a new line for a new paragraph.</p>
          <textarea id="description" name="description" rows={6} defaultValue={values.description}
            aria-invalid={!!errors.description} aria-describedby="description-error" className={inputClass} />
          <FieldError id="description-error" message={errors.description} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="years" className="font-medium">
              Years of experience <span className="font-normal text-muted">(optional)</span>
            </label>
            <input id="years" name="years" inputMode="numeric" defaultValue={values.years}
              aria-invalid={!!errors.years} aria-describedby="years-error" className={inputClass} />
            <FieldError id="years-error" message={errors.years} />
          </div>
          <div>
            <label htmlFor="languages" className="font-medium">Languages spoken</label>
            <input id="languages" name="languages" defaultValue={values.languages}
              placeholder="English, Vietnamese" className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="slug" className="font-medium">
            Web address <span className="font-normal text-muted">(optional)</span>
          </label>
          <p className="text-sm text-muted">Part of the page link. Leave empty to create it from the clinic name.</p>
          <input id="slug" name="slug" defaultValue={values.slug} aria-invalid={!!errors.slug}
            aria-describedby="slug-error" className={inputClass} />
          <FieldError id="slug-error" message={errors.slug} />
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-display text-2xl font-semibold">Prices</h2>
        {TIERS.map((tier) => (
          <PriceRow key={tier} tier={tier} initial={values.prices[tier]} error={errors[`price:${tier}`]} />
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Photos</h2>
        <PhotoUploader key={saveCount} />
      </section>

      <section className="space-y-2">
        <label className="flex items-center gap-2 font-medium">
          <input type="checkbox" name="published" defaultChecked={values.published} className="size-4 accent-accent" />
          Show this clinic on the website
        </label>
        <FieldError id="published-error" message={errors.published} />
      </section>

      <button type="submit" className={primaryButton}>Save clinic</button>
    </form>
  );
}
