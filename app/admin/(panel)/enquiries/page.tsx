import type { Metadata } from "next";
import { Suspense } from "react";
import { EnquiriesList } from "@/components/admin/enquiries-list";

export const metadata: Metadata = { title: "Quote requests" };

export default function EnquiriesPage() {
  return (
    <Suspense fallback={<p role="status" className="text-muted">Loading…</p>}>
      <EnquiriesList />
    </Suspense>
  );
}
