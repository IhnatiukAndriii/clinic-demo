"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteClinic, listClinics, setPublished, StoreError, useDemoData } from "@/lib/store";
import { dangerButton, primaryButton, secondaryButton } from "./styles";

export function ClinicsTable() {
  const clinics = listClinics(useDemoData());
  const [error, setError] = useState<string | null>(null);

  function run(action: () => void) {
    try {
      action();
      setError(null);
    } catch (caught) {
      setError(caught instanceof StoreError ? caught.message : "That change could not be saved.");
    }
  }

  function remove(id: string, name: string) {
    if (window.confirm(`Delete ${name}? This cannot be undone.`)) run(() => deleteClinic(id));
  }

  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Clinics</h1>
        <Link href="/admin/clinics/new" className={primaryButton}>Add clinic</Link>
      </div>
      {error && <p role="alert" className="mb-4 text-danger">{error}</p>}

      {clinics.length === 0 ? (
        <p className="rounded-xl border border-line bg-surface p-6">
          No clinics yet. Add your first clinic to get started.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-left">
            <thead className="border-b border-line text-sm text-muted">
              <tr>
                <th scope="col" className="p-4 font-medium">Clinic</th>
                <th scope="col" className="p-4 font-medium">City</th>
                <th scope="col" className="p-4 font-medium">On the website</th>
                <th scope="col" className="p-4 font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {clinics.map((clinic) => (
                <tr key={clinic.id} className="border-b border-line last:border-0">
                  <th scope="row" className="p-4 font-medium">{clinic.name}</th>
                  <td className="p-4">{clinic.city}</td>
                  <td className="p-4">
                    <button type="button" className={secondaryButton}
                      aria-label={`${clinic.is_published ? "Hide" : "Show"} ${clinic.name}`}
                      onClick={() => run(() => setPublished(clinic.id, !clinic.is_published))}>
                      {clinic.is_published ? "Shown. Hide it" : "Hidden. Show it"}
                    </button>
                  </td>
                  <td className="space-x-3 p-4 text-right">
                    <Link href={`/admin/clinics/${clinic.id}`} className="font-medium text-accent hover:underline">
                      Edit<span className="sr-only"> {clinic.name}</span>
                    </Link>
                    <button type="button" className={dangerButton} onClick={() => remove(clinic.id, clinic.name)}>
                      Delete<span className="sr-only"> {clinic.name}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
