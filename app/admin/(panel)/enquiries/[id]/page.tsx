import type { Metadata } from "next";
import { EnquiryDetail } from "@/components/admin/enquiry-detail";

export const metadata: Metadata = { title: "Quote request" };

export default async function EnquiryPage({ params }: PageProps<"/admin/enquiries/[id]">) {
  const { id } = await params;
  return <EnquiryDetail id={id} />;
}
