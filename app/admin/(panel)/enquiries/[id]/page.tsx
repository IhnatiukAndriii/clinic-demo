import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { inputClass, primaryButton } from "@/components/admin/styles";
import { requireUser } from "@/lib/auth";
import { CHANNEL_LABELS, type Channel } from "@/lib/enquiry";
import { STATUS_LABELS, STATUSES, type EnquiryStatus } from "@/lib/enquiry-status";
import { updateStatus } from "../actions";

export const metadata: Metadata = { title: "Quote request" };

interface EnquiryDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  preferred_channel: Channel;
  message: string;
  status: EnquiryStatus;
  created_at: string;
  clinics: { name: string } | null;
  treatments: { name: string } | null;
}

export default async function EnquiryPage({ params }: PageProps<"/admin/enquiries/[id]">) {
  const { id } = await params;
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*, clinics(name), treatments(name)")
    .eq("id", id)
    .maybeSingle<EnquiryDetail>();
  if (error) throw new Error(`Could not load the quote request: ${error.message}`);
  if (!data) notFound();

  const details: [string, string][] = [
    ["Received", new Date(data.created_at).toLocaleString("en-AU")],
    ["Clinic", data.clinics?.name ?? "Clinic removed"],
    ["Treatment", data.treatments?.name ?? "Not specified"],
    ["Email", data.email],
    ["Phone", data.phone ?? "Not given"],
    ["Prefers to be contacted by", CHANNEL_LABELS[data.preferred_channel]],
  ];

  return (
    <main className="max-w-2xl">
      <Link href="/admin/enquiries" className="text-sm text-accent hover:underline">Back to quote requests</Link>
      <h1 className="mb-8 mt-3 font-display text-3xl font-semibold">{data.name}</h1>

      <dl className="space-y-3 rounded-xl border border-line bg-surface p-6">
        {details.map(([label, value]) => (
          <div key={label} className="grid gap-1 sm:grid-cols-[14rem_1fr]">
            <dt className="text-muted">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mb-2 mt-8 font-display text-xl font-semibold">Message</h2>
      <p className="whitespace-pre-wrap rounded-xl border border-line bg-surface p-6">{data.message}</p>

      <form action={updateStatus.bind(null, data.id)} className="mt-8 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="status" className="font-medium">Status</label>
          <select id="status" name="status" defaultValue={data.status} className={inputClass}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>{STATUS_LABELS[status]}</option>
            ))}
          </select>
        </div>
        <button type="submit" className={primaryButton}>Update status</button>
      </form>
    </main>
  );
}
