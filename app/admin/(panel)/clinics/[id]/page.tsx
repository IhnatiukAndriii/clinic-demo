import type { Metadata } from "next";
import { ClinicEditor } from "@/components/admin/clinic-editor";

export const metadata: Metadata = { title: "Edit clinic" };

export default async function EditClinicPage({
  params,
  searchParams,
}: PageProps<"/admin/clinics/[id]">) {
  const { id } = await params;
  const { saved } = await searchParams;
  return <ClinicEditor clinicId={id} saved={saved === "1"} />;
}
