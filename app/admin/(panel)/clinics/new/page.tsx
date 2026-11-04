import type { Metadata } from "next";
import { ClinicForm } from "@/components/admin/clinic-form";
import { requireUser } from "@/lib/auth";
import { emptyPrice, type ClinicFormValues } from "@/lib/clinic-form";

export const metadata: Metadata = { title: "Add clinic" };

export default async function NewClinicPage() {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("treatments").select("id, name").order("name");
  if (error) throw new Error(`Could not load treatments: ${error.message}`);
  const treatments = (data ?? []) as { id: string; name: string }[];

  const initial: ClinicFormValues = {
    name: "",
    slug: "",
    city: "",
    country: "Vietnam",
    description: "",
    years: "",
    languages: "",
    published: false,
    prices: Object.fromEntries(treatments.map((t) => [t.id, emptyPrice()])),
    newPhotos: [],
  };

  return (
    <main className="max-w-3xl">
      <h1 className="mb-8 font-display text-3xl font-semibold">Add clinic</h1>
      <ClinicForm clinicId={null} treatments={treatments} initial={initial} />
    </main>
  );
}
