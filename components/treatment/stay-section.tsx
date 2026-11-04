"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/ui/section-header";
import { countClinicsWithStay, listCities } from "@/lib/directory";
import { listClinics, useDemoData } from "@/lib/store";

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

export function StaySection() {
  const clinics = listClinics(useDemoData(), { publishedOnly: true });
  const cities = listCities(clinics);
  const withStay = countClinicsWithStay(clinics);

  const points = [
    {
      title: `${cities.length} ${cities.length === 1 ? "city" : "cities"} to choose from`,
      text: cities.length > 0 ? `Clinics in ${joinList(cities)}.` : "Clinics are added here as they join.",
    },
    {
      title: "Transfers and hotel nights are listed",
      text: `${withStay} of ${clinics.length} clinics list airport transfers or hotel nights in their inclusions. Check each package for the details.`,
    },
    {
      title: "You can see who speaks your language",
      text: "The languages each team speaks are shown on every clinic card.",
    },
  ];

  return (
    <section aria-labelledby="stay-title" className="section-pad bg-sand-100">
      <div className="page-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="grid grid-cols-5 gap-4">
          <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-panel shadow-card">
            <Image
              src="/demo/street.jpg"
              alt="A Vietnamese street with scooters"
              fill
              sizes="(min-width: 1152px) 330px, (min-width: 1024px) 30vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="relative col-span-2 mt-12 aspect-[2/3] overflow-hidden rounded-panel shadow-card">
            <Image
              src="/demo/city-aerial.jpg"
              alt="An aerial view of a Vietnamese city by day"
              fill
              sizes="(min-width: 1152px) 220px, (min-width: 1024px) 20vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
        <div>
          <SectionHeader
            id="stay-title"
            title="Combine your treatment with a stay in Vietnam"
            intro="Many patients plan appointments around a short visit. Here is what the listings show."
          />
          <ul className="mt-10 space-y-6">
            {points.map((point) => (
              <li key={point.title}>
                <h3 className="text-title text-brand-900">{point.title}</h3>
                <p className="mt-1 text-muted">{point.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
