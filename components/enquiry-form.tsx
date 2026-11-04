"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { CHANNELS, CHANNEL_LABELS, parseEnquiry, type EnquiryErrors } from "@/lib/enquiry";
import { createEnquiry, StoreError } from "@/lib/store";

interface EnquiryState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: EnquiryErrors;
  values?: Record<string, string>;
}

const initialState: EnquiryState = { status: "idle" };

const labelClass = "font-semibold text-ink";
const fieldClass =
  "mt-1 w-full rounded-control border-2 border-sand-300 bg-white px-4 py-3 text-base transition-colors duration-150 hover:border-brand-200 aria-[invalid=true]:border-danger";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-caption font-semibold text-danger">
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
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "error") {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [state]);

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
      <div role="status" className="rounded-card bg-brand-50 p-6">
        <h3 className="text-title text-brand-900">Request sent</h3>
        <p className="mt-2">
          {clinicName} has your request. Expect a reply on your chosen channel, usually within one working day.
        </p>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      <input type="hidden" name="clinicId" value={clinicId} />
      <input type="hidden" name="treatmentId" value={treatmentId} />

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-control border-2 border-danger p-4 font-semibold text-danger">
          {state.message}
        </p>
      )}
      {(errors.clinicId || errors.treatmentId) && (
        <p role="alert" className="text-caption font-semibold text-danger">
          {errors.clinicId ?? errors.treatmentId}
        </p>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>Your name</label>
        <input id="name" name="name" autoComplete="name" defaultValue={values.name}
          aria-invalid={!!errors.name} aria-describedby="name-error" className={fieldClass} />
        <FieldError id="name-error" message={errors.name} />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" defaultValue={values.email}
          aria-invalid={!!errors.email} aria-describedby="email-error" className={fieldClass} />
        <FieldError id="email-error" message={errors.email} />
      </div>
      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={values.phone}
          aria-invalid={!!errors.phone} aria-describedby="phone-error" className={fieldClass} />
        <FieldError id="phone-error" message={errors.phone} />
      </div>
      <div>
        <label htmlFor="channel" className={labelClass}>Best way to reach you</label>
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
        <label htmlFor="message" className={labelClass}>Your message</label>
        <textarea id="message" name="message" rows={4} defaultValue={values.message}
          aria-invalid={!!errors.message} aria-describedby="message-error" className={fieldClass} />
        <FieldError id="message-error" message={errors.message} />
      </div>
      <Button type="submit" size="lg" className="w-full">
        Send request
      </Button>
    </form>
  );
}
