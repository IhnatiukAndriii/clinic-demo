import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicPhotoImage } from "@/components/clinic-photo";
import { EnquiryForm } from "@/components/enquiry-form";
import { formatPriceRange } from "@/lib/format";
import { getClinicProfile } from "@/lib/queries";

export async function generateMetadata({ params }: PageProps<"/clinics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const clinic = await getClinicProfile(slug);
  if (!clinic) return {};
  return {
    title: `${clinic.name}, ${clinic.city}`,
    description: clinic.description.split("\n")[0].slice(0, 160),
  };
}

export default async function ClinicPage({ params }: PageProps<"/clinics/[slug]">) {
  const { slug } = await params;
  const clinic = await getClinicProfile(slug);
  if (!clinic) notFound();

  const [mainPhoto, ...otherPhotos] = clinic.photos;
  const enquiryTreatment = clinic.treatments[0];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{clinic.name}</h1>
      <p className="mt-3 text-lg text-muted">
        {clinic.city}, {clinic.country}
        {clinic.years_experience ? `, ${clinic.years_experience} years of experience` : ""}
      </p>

      <section aria-label="Photos" className="mt-10 grid gap-3 sm:grid-cols-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-96">
          <ClinicPhotoImage photo={mainPhoto} name={clinic.name} sizes="(min-width: 640px) 66vw, 100vw" priority />
        </div>
        {otherPhotos.slice(0, 2).map((photo) => (
          <div key={photo.storage_path} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <ClinicPhotoImage photo={photo} name={clinic.name} sizes="(min-width: 640px) 33vw, 100vw" />
          </div>
        ))}
      </section>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_26rem]">
        <div className="space-y-14">
          <section className="max-w-prose space-y-4 text-lg">
            {clinic.description.split("\n").filter(Boolean).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {clinic.languages.length > 0 && (
              <p className="text-base text-muted">Languages: {clinic.languages.join(", ")}</p>
            )}
          </section>

          <section>
            <h2 className="font-display text-3xl font-semibold">Treatments and prices</h2>
            <div className="mt-6 space-y-6">
              {clinic.treatments.map((item) => (
                <div key={item.treatment.id} className="rounded-2xl border border-line bg-surface p-6">
                  <h3 className="text-xl font-semibold">{item.treatment.name}</h3>
                  <p className="mt-1 font-display text-2xl font-semibold text-accent">{formatPriceRange(item)}</p>
                  {item.inclusions.length > 0 && (
                    <>
                      <p className="mt-4 font-medium">Included in the price</p>
                      <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                        {item.inclusions.map((inclusion) => (
                          <li key={inclusion} className="flex gap-2">
                            <span aria-hidden className="text-accent">✓</span>
                            {inclusion}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <section id="enquiry" className="h-fit scroll-mt-8 rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-8">
          <h2 className="font-display text-2xl font-semibold">Get a free quote</h2>
          <p className="mb-6 mt-2 text-muted">Tell {clinic.name} what you need. There is no obligation.</p>
          {enquiryTreatment ? (
            <EnquiryForm
              clinicId={clinic.id}
              clinicName={clinic.name}
              treatmentId={enquiryTreatment.treatment.id}
            />
          ) : (
            <p>This clinic is not taking requests yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
