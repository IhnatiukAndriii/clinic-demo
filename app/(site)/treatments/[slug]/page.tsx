import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicsSection } from "@/components/treatment/clinics-section";
import { ComparisonTable } from "@/components/treatment/comparison-table";
import { CtaBand } from "@/components/treatment/cta-band";
import { GuideFaq } from "@/components/treatment/guide-faq";
import { Hero } from "@/components/treatment/hero";
import { HowItWorks } from "@/components/treatment/how-it-works";
import { StaySection } from "@/components/treatment/stay-section";
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
    <main>
      <Hero title={`${treatment.name} in Vietnam`} summary={treatment.summary} />
      <ComparisonTable />
      <ClinicsSection />
      <HowItWorks />
      <StaySection />
      <GuideFaq />
      <CtaBand />
    </main>
  );
}
