import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { CHANNEL_LABELS, type Channel } from "@/lib/enquiry";
import { isStatus, STATUS_LABELS, STATUSES, type EnquiryStatus } from "@/lib/enquiry-status";

export const metadata: Metadata = { title: "Quote requests" };

interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  preferred_channel: Channel;
  status: EnquiryStatus;
  created_at: string;
  clinics: { name: string } | null;
}

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  const { status } = await searchParams;
  const filter = isStatus(status) ? status : null;
  const { supabase } = await requireUser();

  let query = supabase
    .from("enquiries")
    .select("id, name, email, preferred_channel, status, created_at, clinics(name)")
    .order("created_at", { ascending: false });
  if (filter) query = query.eq("status", filter);
  const { data, error } = await query.returns<EnquiryRow[]>();
  if (error) throw new Error(`Could not load quote requests: ${error.message}`);
  const enquiries = data ?? [];

  return (
    <main>
      <h1 className="mb-6 font-display text-3xl font-semibold">Quote requests</h1>

      <nav aria-label="Filter by status" className="mb-6 flex flex-wrap gap-2">
        {[null, ...STATUSES].map((value) => {
          const active = value === filter;
          return (
            <Link
              key={value ?? "all"}
              href={value ? `/admin/enquiries?status=${value}` : "/admin/enquiries"}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                active ? "border-accent bg-accent text-white" : "border-line bg-surface hover:border-accent"
              }`}
            >
              {value ? STATUS_LABELS[value] : "All"}
            </Link>
          );
        })}
      </nav>

      {enquiries.length === 0 ? (
        <p className="rounded-xl border border-line bg-surface p-6">
          {filter ? `No ${STATUS_LABELS[filter].toLowerCase()} quote requests.` : "No quote requests yet."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-left">
            <thead className="border-b border-line text-sm text-muted">
              <tr>
                <th scope="col" className="p-4 font-medium">Received</th>
                <th scope="col" className="p-4 font-medium">Name</th>
                <th scope="col" className="p-4 font-medium">Clinic</th>
                <th scope="col" className="p-4 font-medium">Contact by</th>
                <th scope="col" className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="border-b border-line last:border-0">
                  <td className="p-4">{new Date(enquiry.created_at).toLocaleDateString("en-AU")}</td>
                  <th scope="row" className="p-4 font-medium">
                    <Link href={`/admin/enquiries/${enquiry.id}`} className="text-accent hover:underline">
                      {enquiry.name}
                    </Link>
                  </th>
                  <td className="p-4">{enquiry.clinics?.name ?? "Clinic removed"}</td>
                  <td className="p-4">{CHANNEL_LABELS[enquiry.preferred_channel]}</td>
                  <td className="p-4">{STATUS_LABELS[enquiry.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
