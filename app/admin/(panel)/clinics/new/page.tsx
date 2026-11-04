import type { Metadata } from "next";
import { ClinicEditor } from "@/components/admin/clinic-editor";

export const metadata: Metadata = { title: "Add clinic" };

export default function NewClinicPage() {
  return <ClinicEditor clinicId={null} />;
}
