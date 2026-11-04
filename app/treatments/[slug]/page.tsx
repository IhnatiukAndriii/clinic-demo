import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicCard } from "@/components/clinic-card";
import { getClinicsForTreatment, getTreatment } from "@/lib/queries";

export async function generateMetadata({ params }: PageProps<"/treatments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const treatment = await getTreatment(slug);
  if (!treatment) return {};
  return {
    title: `${treatment.name} in Vietnam`,
    description: treatment.summary,
  };
}

export default async function TreatmentPage({ params }: PageProps<"/treatments/[slug]">) {
  const { slug } = await params;
  const treatment = await getTreatment(slug);
  if (!treatment) notFound();

  const clinics = await getClinicsForTreatment(treatment.id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
        {treatment.name} in Vietnam
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">{treatment.summary}</p>

      {clinics.length === 0 ? (
        <p className="mt-16 rounded-2xl border border-line bg-surface p-8">
          No clinics are listed for this treatment yet. Check back soon.
        </p>
      ) : (
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {clinics.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>
      )}
    </main>
  );
}
