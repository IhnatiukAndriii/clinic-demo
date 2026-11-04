"use client";

import { directoryFacts } from "@/lib/directory";
import { listClinics, useDemoData } from "@/lib/store";

export function HeroFacts() {
  const clinics = listClinics(useDemoData(), { publishedOnly: true });
  const facts = directoryFacts(clinics);
  const items = [
    { value: String(facts.clinicCount), label: facts.clinicCount === 1 ? "clinic listed" : "clinics listed" },
    { value: String(facts.cityCount), label: facts.cityCount === 1 ? "city" : "cities" },
    { value: facts.currencies.join(", ") || "AUD", label: "prices shown in" },
  ];
  return (
    <dl className="mt-16 grid grid-cols-3 gap-4 border-t border-white/30 py-8 sm:max-w-2xl">
      {items.map((item) => (
        <div key={item.label}>
          <dd className="font-display text-3xl font-semibold sm:text-4xl">{item.value}</dd>
          <dt className="mt-1 text-brand-100">{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}
