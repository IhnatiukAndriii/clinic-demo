"use client";

import { useActionState } from "react";
import { saveClinic, type ClinicFormState } from "@/app/admin/(panel)/clinics/actions";
import { emptyPrice, type ClinicFormValues } from "@/lib/clinic-form";
import { PhotoUploader } from "./photo-uploader";
import { PriceRow } from "./price-row";
import { inputClass, primaryButton } from "./styles";

interface TreatmentOption {
  id: string;
  name: string;
}

interface Props {
  clinicId: string | null;
  treatments: TreatmentOption[];
  initial: ClinicFormValues;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={id} className="mt-1 text-sm text-danger">{message}</p>;
}

export function ClinicForm({ clinicId, treatments, initial }: Props) {
  const [state, action, pending] = useActionState<ClinicFormState, FormData>(
    saveClinic.bind(null, clinicId),
    {},
  );
  const values = state.values ?? initial;
  const errors = state.errors ?? {};

  return (
    <form action={action} noValidate className="space-y-10">
      {state.message && (
        <p role="alert" className="rounded-lg border border-danger p-4 text-danger">{state.message}</p>
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
        {treatments.map((treatment) => (
          <PriceRow
            key={treatment.id}
            treatmentId={treatment.id}
            treatmentName={treatment.name}
            initial={values.prices[treatment.id] ?? emptyPrice()}
            error={errors[`price:${treatment.id}`]}
          />
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Photos</h2>
        <PhotoUploader />
      </section>

      <section className="space-y-2">
        <label className="flex items-center gap-2 font-medium">
          <input type="checkbox" name="published" defaultChecked={values.published} className="size-4 accent-accent" />
          Show this clinic on the website
        </label>
        <FieldError id="published-error" message={errors.published} />
      </section>

      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "Saving…" : "Save clinic"}
      </button>
    </form>
  );
}
