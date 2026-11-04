import type { Metadata } from "next";
import { ClinicProfile } from "@/components/clinic-profile";
import { SEED_CLINICS } from "@/lib/seed";

export function generateStaticParams() {
  return SEED_CLINICS.map((clinic) => ({ slug: clinic.slug }));
}

export async function generateMetadata({ params }: PageProps<"/clinics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const clinic = SEED_CLINICS.find((c) => c.slug === slug);
  if (!clinic) return { title: "Clinic" };
  return {
    title: `${clinic.name}, ${clinic.city}`,
    description: clinic.description.split("\n")[0].slice(0, 160),
  };
}

export default async function ClinicPage({ params }: PageProps<"/clinics/[slug]">) {
  const { slug } = await params;
  return <ClinicProfile slug={slug} />;
}
