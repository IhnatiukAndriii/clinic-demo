import type { Metadata } from "next";
import { ClinicsTable } from "@/components/admin/clinics-table";

export const metadata: Metadata = { title: "Clinics" };

export default function ClinicsPage() {
  return <ClinicsTable />;
}
