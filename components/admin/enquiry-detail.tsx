"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CHANNEL_LABELS } from "@/lib/enquiry";
import { isStatus, STATUS_LABELS, STATUSES } from "@/lib/enquiry-status";
import {
  getClinic,
  getEnquiry,
  StoreError,
  updateEnquiryStatus,
  useDemoData,
} from "@/lib/store";
import { getTreatmentById } from "@/lib/seed";
import { inputClass, primaryButton } from "./styles";

export function EnquiryDetail({ id }: { id: string }) {
  const data = useDemoData();
  const enquiry = getEnquiry(data, id);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  if (!enquiry) {
    return (
      <main className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold">Quote request not found</h1>
        <p className="mt-3">
          <Link href="/admin/enquiries" className="text-accent hover:underline">Back to quote requests</Link>
        </p>
      </main>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const status = new FormData(event.currentTarget).get("status");
    if (!isStatus(status)) {
      setMessage({ text: "Choose a valid status: new, contacted or closed.", ok: false });
      return;
    }
    try {
      updateEnquiryStatus(id, status);
      setMessage({ text: "Status updated.", ok: true });
    } catch (error) {
      setMessage({
        text: error instanceof StoreError ? error.message : "The status could not be saved.",
        ok: false,
      });
    }
  }

  const details: [string, string][] = [
    ["Received", new Date(enquiry.created_at).toLocaleString("en-AU")],
    ["Clinic", getClinic(data, enquiry.clinic_id)?.name ?? "Clinic removed"],
    ["Treatment", getTreatmentById(enquiry.treatment_id)?.name ?? "Not specified"],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone ?? "Not given"],
    ["Prefers to be contacted by", CHANNEL_LABELS[enquiry.preferred_channel]],
  ];

  return (
    <main className="max-w-2xl">
      <Link href="/admin/enquiries" className="text-sm text-accent hover:underline">Back to quote requests</Link>
      <h1 className="mb-8 mt-3 font-display text-3xl font-semibold">{enquiry.name}</h1>

      <dl className="space-y-3 rounded-xl border border-line bg-surface p-6">
        {details.map(([label, value]) => (
          <div key={label} className="grid gap-1 sm:grid-cols-[14rem_1fr]">
            <dt className="text-muted">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mb-2 mt-8 font-display text-xl font-semibold">Message</h2>
      <p className="whitespace-pre-wrap rounded-xl border border-line bg-surface p-6">{enquiry.message}</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="status" className="font-medium">Status</label>
          <select id="status" name="status" defaultValue={enquiry.status} className={inputClass}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>{STATUS_LABELS[status]}</option>
            ))}
          </select>
        </div>
        <button type="submit" className={primaryButton}>Update status</button>
      </form>
      {message && (
        <p role={message.ok ? "status" : "alert"} className={`mt-4 ${message.ok ? "text-accent-strong" : "text-danger"}`}>
          {message.text}
        </p>
      )}
    </main>
  );
}
