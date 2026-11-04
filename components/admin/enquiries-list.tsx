"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CHANNEL_LABELS } from "@/lib/enquiry";
import { isStatus, STATUS_LABELS, STATUSES } from "@/lib/enquiry-status";
import { getClinic, listEnquiries, useDemoData } from "@/lib/store";

export function EnquiriesList() {
  const data = useDemoData();
  const status = useSearchParams().get("status");
  const filter = isStatus(status) ? status : null;
  const enquiries = listEnquiries(data, filter);

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
                  <td className="p-4">{getClinic(data, enquiry.clinic_id)?.name ?? "Clinic removed"}</td>
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
