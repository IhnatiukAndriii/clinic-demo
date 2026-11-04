import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TreatmentClinics } from "@/components/treatment-clinics";
import { getTreatment, listTreatments } from "@/lib/seed";

export function generateStaticParams() {
  return listTreatments().map((treatment) => ({ slug: treatment.slug }));
}

export async function generateMetadata({ params }: PageProps<"/treatments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) return {};
  return {
    title: `${treatment.name} in Vietnam`,
    description: treatment.summary,
  };
}

export default async function TreatmentPage({ params }: PageProps<"/treatments/[slug]">) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
        {treatment.name} in Vietnam
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">{treatment.summary}</p>
      <TreatmentClinics />
    </main>
  );
}
