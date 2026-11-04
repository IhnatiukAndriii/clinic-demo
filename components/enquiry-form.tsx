"use client";

import { useState, type FormEvent } from "react";
import { CHANNELS, CHANNEL_LABELS, parseEnquiry, type EnquiryErrors } from "@/lib/enquiry";
import { createEnquiry, StoreError } from "@/lib/store";

interface EnquiryState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: EnquiryErrors;
  values?: Record<string, string>;
}

const initialState: EnquiryState = { status: "idle" };

const fieldClass =
  "mt-1 w-full rounded-xl border border-line bg-surface px-4 py-3 text-base aria-[invalid=true]:border-danger";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-danger">
      {message}
    </p>
  );
}

interface Props {
  clinicId: string;
  clinicName: string;
  treatmentId: string;
}

export function EnquiryForm({ clinicId, clinicName, treatmentId }: Props) {
  const [state, setState] = useState<EnquiryState>(initialState);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = parseEnquiry(new FormData(event.currentTarget));
    if (!result.ok) {
      setState({
        status: "error",
        message: "Please fix the highlighted fields and send again.",
        errors: result.errors,
        values: { ...result.value },
      });
      return;
    }
    try {
      createEnquiry(result.value);
      setState({ status: "success" });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof StoreError ? error.message : "We could not send your request. Please try again.",
        values: { ...result.value },
      });
    }
  }

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-2xl bg-accent-soft p-8">
        <h3 className="font-display text-2xl font-semibold text-accent-strong">Request sent</h3>
        <p className="mt-2">
          {clinicName} has your request. Expect a reply on your chosen channel, usually within one working day.
        </p>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <input type="hidden" name="clinicId" value={clinicId} />
      <input type="hidden" name="treatmentId" value={treatmentId} />

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl border border-danger p-4 text-danger">
          {state.message}
        </p>
      )}
      {(errors.clinicId || errors.treatmentId) && (
        <p role="alert" className="text-sm text-danger">
          {errors.clinicId ?? errors.treatmentId}
        </p>
      )}

      <div>
        <label htmlFor="name" className="font-medium">Your name</label>
        <input id="name" name="name" autoComplete="name" defaultValue={values.name}
          aria-invalid={!!errors.name} aria-describedby="name-error" className={fieldClass} />
        <FieldError id="name-error" message={errors.name} />
      </div>
      <div>
        <label htmlFor="email" className="font-medium">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" defaultValue={values.email}
          aria-invalid={!!errors.email} aria-describedby="email-error" className={fieldClass} />
        <FieldError id="email-error" message={errors.email} />
      </div>
      <div>
        <label htmlFor="phone" className="font-medium">
          Phone <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={values.phone}
          aria-invalid={!!errors.phone} aria-describedby="phone-error" className={fieldClass} />
        <FieldError id="phone-error" message={errors.phone} />
      </div>
      <div>
        <label htmlFor="channel" className="font-medium">Best way to reach you</label>
        <select id="channel" name="channel" defaultValue={values.channel ?? ""}
          aria-invalid={!!errors.channel} aria-describedby="channel-error" className={fieldClass}>
          <option value="" disabled>Choose one</option>
          {CHANNELS.map((channel) => (
            <option key={channel} value={channel}>{CHANNEL_LABELS[channel]}</option>
          ))}
        </select>
        <FieldError id="channel-error" message={errors.channel} />
      </div>
      <div>
        <label htmlFor="message" className="font-medium">Your message</label>
        <textarea id="message" name="message" rows={5} defaultValue={values.message}
          aria-invalid={!!errors.message} aria-describedby="message-error" className={fieldClass} />
        <FieldError id="message-error" message={errors.message} />
      </div>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 font-semibold text-white hover:bg-accent-strong"
      >
        Send request
      </button>
    </form>
  );
}
