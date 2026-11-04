import Link from "next/link";
import { formatPriceFrom } from "@/lib/format";
import type { ClinicCardData } from "@/lib/types";
import { ClinicPhotoImage } from "./clinic-photo";

export function ClinicCard({ clinic }: { clinic: ClinicCardData }) {
  const profile = `/clinics/${clinic.slug}`;
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <Link href={profile} className="relative block aspect-[4/3] bg-accent-soft">
        <ClinicPhotoImage
          photo={clinic.photos[0]}
          name={clinic.name}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <h2 className="font-display text-2xl font-semibold leading-tight">
            <Link href={profile} className="hover:text-accent">
              {clinic.name}
            </Link>
          </h2>
          <p className="mt-1 text-muted">{clinic.city}</p>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted">Languages</dt>
            <dd className="font-medium">{clinic.languages.join(", ") || "Ask the clinic"}</dd>
          </div>
          <div>
            <dt className="text-muted">Experience</dt>
            <dd className="font-medium">
              {clinic.years_experience ? `${clinic.years_experience} years` : "Ask the clinic"}
            </dd>
          </div>
        </dl>
        <div>
          <p className="font-display text-2xl font-semibold text-accent">{formatPriceFrom(clinic)}</p>
          <ul className="mt-3 space-y-1 text-sm">
            {clinic.inclusions.slice(0, 3).map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-accent">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={`${profile}#enquiry`}
          className="mt-auto inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 font-semibold text-white hover:bg-accent-strong"
        >
          Get a free quote
        </Link>
      </div>
    </article>
  );
}
