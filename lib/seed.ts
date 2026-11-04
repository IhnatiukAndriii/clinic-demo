// Demo data: every clinic, name, price and description below is fictional and
// exists only to illustrate the directory. It does not describe real businesses.
import type { Clinic, ClinicTreatment, DemoData, Treatment } from "./types";

export const TREATMENT_ID = "dental-implants";

export const SEED_TREATMENTS: Treatment[] = [
  {
    id: TREATMENT_ID,
    slug: "dental-implants",
    name: "Dental Implants",
    summary:
      "Replace missing teeth with titanium implants placed by experienced implant dentists in Vietnam, with clear all-inclusive packages.",
    body: "A dental implant is a small titanium post placed in the jawbone to support a crown, bridge or denture. Many patients combine treatment with a short stay, so packages below list exactly what is included.",
  },
];

function tiers(
  single: [number, number, string[]],
  fullArch: [number, number, string[]],
): ClinicTreatment[] {
  return [
    {
      treatment_id: TREATMENT_ID,
      tier: "single",
      price_from: single[0],
      price_to: single[1],
      currency: "AUD",
      price_unit: "per implant",
      inclusions: single[2],
    },
    {
      treatment_id: TREATMENT_ID,
      tier: "full-arch",
      price_from: fullArch[0],
      price_to: fullArch[1],
      currency: "AUD",
      price_unit: "per jaw",
      inclusions: fullArch[2],
    },
  ];
}

function photos(clinicId: string, sources: string[]): Clinic["photos"] {
  return sources.map((src, index) => ({ id: `${clinicId}-photo-${index + 1}`, src, sort_order: index }));
}

export const SEED_CLINICS: Clinic[] = [
  {
    id: "clinic-1",
    slug: "saigon-smile-studio",
    name: "Saigon Smile Studio",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    description:
      "A boutique implant practice in District 1, built around a single-visit planning day and a calm, unhurried consultation.\nThe team plans each case from a 3D scan and walks you through the steps before treatment begins, in English and Vietnamese.",
    years_experience: 12,
    languages: ["English", "Vietnamese"],
    is_published: true,
    photos: photos("clinic-1", ["/demo/clinic-1.jpg", "/demo/consult.jpg", "/demo/hero.jpg"]),
    treatments: tiers(
      [1200, 1800, ["CT scan", "Porcelain crown", "Airport transfer", "2 hotel nights"]],
      [9800, 13000, ["CT scan", "Full-arch prosthesis", "Airport transfer", "4 hotel nights"]],
    ),
  },
  {
    id: "clinic-2",
    slug: "lotus-dental-care",
    name: "Lotus Dental Care",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    description:
      "A larger clinic near the airport with its own imaging suite, suited to patients who want treatment and travel logistics handled together.\nCoordinators help with accommodation and transfers so you can focus on your appointments.",
    years_experience: 9,
    languages: ["English", "Vietnamese", "Korean"],
    is_published: true,
    photos: photos("clinic-2", ["/demo/clinic-2.jpg", "/demo/clinic-4.jpg", "/demo/consult.jpg"]),
    treatments: tiers(
      [1100, 1600, ["CT scan", "Titanium implant", "Porcelain crown", "Airport transfer", "3 hotel nights"]],
      [9200, 12000, ["CT scan", "Full-arch prosthesis", "Airport transfer", "5 hotel nights"]],
    ),
  },
  {
    id: "clinic-3",
    slug: "hanoi-old-quarter-dental",
    name: "Hanoi Old Quarter Dental",
    city: "Hanoi",
    country: "Vietnam",
    description:
      "A family-run practice in Hanoi's Old Quarter, known for careful bone assessment and a measured approach to treatment planning.\nPatients stay within walking distance of the clinic, which keeps follow-up visits simple.",
    years_experience: 15,
    languages: ["English", "Vietnamese", "French"],
    is_published: true,
    photos: photos("clinic-3", ["/demo/clinic-3.jpg", "/demo/clinic-1.jpg", "/demo/hero.jpg"]),
    treatments: tiers(
      [1300, 1900, ["3D scan", "Titanium implant", "Crown fitting", "Follow-up check"]],
      [10500, 13800, ["3D scan", "Full-arch prosthesis", "Follow-up check"]],
    ),
  },
  {
    id: "clinic-4",
    slug: "danang-bay-implant-centre",
    name: "Da Nang Bay Implant Centre",
    city: "Da Nang",
    country: "Vietnam",
    description:
      "A modern implant centre a short drive from the beach, combining treatment with a relaxed recovery stay.\nThe team offers clear written quotes and keeps the same dentist with you from consultation to final crown.",
    years_experience: 7,
    languages: ["English", "Vietnamese"],
    is_published: true,
    photos: photos("clinic-4", ["/demo/clinic-4.jpg", "/demo/clinic-2.jpg", "/demo/consult.jpg"]),
    treatments: tiers(
      [1000, 1500, ["CT scan", "Titanium implant", "Airport transfer", "Follow-up check"]],
      [9500, 12500, ["CT scan", "Full-arch prosthesis", "Airport transfer", "4 hotel nights", "Follow-up check"]],
    ),
  },
];

export const SEED_DATA: DemoData = { clinics: SEED_CLINICS, enquiries: [] };

export function listTreatments(): Treatment[] {
  return SEED_TREATMENTS;
}

export function getTreatment(slug: string): Treatment | undefined {
  return SEED_TREATMENTS.find((t) => t.slug === slug);
}

export function getTreatmentById(id: string): Treatment | undefined {
  return SEED_TREATMENTS.find((t) => t.id === id);
}
