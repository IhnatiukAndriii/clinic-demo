import { useSyncExternalStore } from "react";
import type { ClinicInput } from "./clinic-form";
import type { EnquiryInput } from "./enquiry";
import type { EnquiryStatus } from "./enquiry-status";
import { SEED_DATA, TREATMENT_ID } from "./seed";
import type { Clinic, ClinicPhoto, ClinicTreatment, DemoData, Enquiry } from "./types";

const STORAGE_KEY = "implants-vietnam-demo-v1";

export class StoreError extends Error {
  constructor(
    message: string,
    readonly field?: string,
  ) {
    super(message);
  }
}

// ---------------------------------------------------------------- storage core

let current: DemoData | null = null;
const listeners = new Set<() => void>();

function isDemoData(value: unknown): value is DemoData {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Partial<DemoData>;
  return (
    Array.isArray(data.clinics) &&
    Array.isArray(data.enquiries) &&
    data.clinics.every(
      (c) =>
        typeof c?.id === "string" &&
        typeof c.slug === "string" &&
        typeof c.name === "string" &&
        Array.isArray(c.photos) &&
        Array.isArray(c.treatments) &&
        Array.isArray(c.languages),
    )
  );
}

function readStorage(): DemoData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_DATA;
    const parsed: unknown = JSON.parse(raw);
    return isDemoData(parsed) ? parsed : SEED_DATA;
  } catch {
    return current ?? SEED_DATA;
  }
}

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED" || error.code === 22)
  );
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

/** Saves to localStorage. When storage is unavailable the data stays in memory for this visit. */
function commit(next: DemoData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    if (isQuotaError(error)) {
      throw new StoreError(
        "This browser has no room left to save the demo data. Delete some photos and try again.",
      );
    }
  }
  current = next;
  emit();
}

function onStorage(event: StorageEvent): void {
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  current = readStorage();
  emit();
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): DemoData {
  if (current === null) current = readStorage();
  return current;
}

function getServerSnapshot(): DemoData {
  return SEED_DATA;
}

/** The current data outside React, for event handlers and tests. */
export function readDemoData(): DemoData {
  return getSnapshot();
}

/** Server renders the seed; the browser then switches to whatever is stored. */
export function useDemoData(): DemoData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** False during server rendering and hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

// ------------------------------------------------------------------ selectors

export function sortedPhotos(clinic: Clinic): ClinicPhoto[] {
  return [...clinic.photos].sort((a, b) => a.sort_order - b.sort_order);
}

export function listClinics(data: DemoData, options: { publishedOnly?: boolean } = {}): Clinic[] {
  const clinics = options.publishedOnly ? data.clinics.filter((c) => c.is_published) : data.clinics;
  return [...clinics].sort((a, b) => a.name.localeCompare(b.name));
}

export function getClinic(data: DemoData, idOrSlug: string): Clinic | undefined {
  return data.clinics.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
}

export function getEnquiry(data: DemoData, id: string): Enquiry | undefined {
  return data.enquiries.find((e) => e.id === id);
}

export function listEnquiries(data: DemoData, status?: EnquiryStatus | null): Enquiry[] {
  const items = status ? data.enquiries.filter((e) => e.status === status) : data.enquiries;
  return [...items].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

// ------------------------------------------------------------------ mutations

function newId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  );
}

function modify(change: (data: DemoData) => DemoData): void {
  commit(change(getSnapshot()));
}

function assertSlugFree(data: DemoData, slug: string, ownId: string | null): void {
  if (data.clinics.some((c) => c.slug === slug && c.id !== ownId)) {
    throw new StoreError("Another clinic already uses this web address. Change the web address.", "slug");
  }
}

function toTreatments(prices: ClinicInput["prices"]): ClinicTreatment[] {
  return prices.map((price) => ({
    treatment_id: TREATMENT_ID,
    tier: price.tier,
    price_from: price.priceFrom,
    price_to: price.priceTo,
    currency: "AUD",
    price_unit: price.unit,
    inclusions: price.inclusions,
  }));
}

function appendPhotos(existing: ClinicPhoto[], sources: string[]): ClinicPhoto[] {
  const start = existing.reduce((max, photo) => Math.max(max, photo.sort_order), -1) + 1;
  return [...existing, ...sources.map((src, index) => ({ id: newId(), src, sort_order: start + index }))];
}

function clinicFields(input: ClinicInput) {
  return {
    slug: input.slug,
    name: input.name,
    city: input.city,
    country: input.country,
    description: input.description,
    years_experience: input.yearsExperience,
    languages: input.languages,
    is_published: input.isPublished,
    treatments: toTreatments(input.prices),
  };
}

export function createClinic(input: ClinicInput): Clinic {
  const data = getSnapshot();
  assertSlugFree(data, input.slug, null);
  const clinic: Clinic = {
    id: newId(),
    ...clinicFields(input),
    photos: appendPhotos([], input.newPhotos),
  };
  commit({ ...data, clinics: [...data.clinics, clinic] });
  return clinic;
}

function mapClinic(id: string, change: (clinic: Clinic) => Clinic): void {
  modify((data) => {
    if (!data.clinics.some((c) => c.id === id)) throw new StoreError("This clinic no longer exists.");
    return { ...data, clinics: data.clinics.map((c) => (c.id === id ? change(c) : c)) };
  });
}

export function updateClinic(id: string, input: ClinicInput): void {
  assertSlugFree(getSnapshot(), input.slug, id);
  mapClinic(id, (clinic) => ({
    ...clinic,
    ...clinicFields(input),
    photos: appendPhotos(clinic.photos, input.newPhotos),
  }));
}

export function deleteClinic(id: string): void {
  modify((data) => ({ ...data, clinics: data.clinics.filter((c) => c.id !== id) }));
}

export function setPublished(id: string, published: boolean): void {
  mapClinic(id, (clinic) => ({ ...clinic, is_published: published }));
}

export function addPhoto(clinicId: string, src: string): void {
  mapClinic(clinicId, (clinic) => ({ ...clinic, photos: appendPhotos(clinic.photos, [src]) }));
}

export function updatePhoto(
  clinicId: string,
  photoId: string,
  patch: Partial<Pick<ClinicPhoto, "src" | "sort_order">>,
): void {
  mapClinic(clinicId, (clinic) => ({
    ...clinic,
    photos: clinic.photos.map((p) => (p.id === photoId ? { ...p, ...patch } : p)),
  }));
}

export function movePhoto(clinicId: string, photoId: string, direction: "up" | "down"): void {
  mapClinic(clinicId, (clinic) => {
    const ordered = sortedPhotos(clinic);
    const index = ordered.findIndex((p) => p.id === photoId);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= ordered.length) return clinic;
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    return { ...clinic, photos: ordered.map((p, order) => ({ ...p, sort_order: order })) };
  });
}

export function deletePhoto(clinicId: string, photoId: string): void {
  mapClinic(clinicId, (clinic) => ({ ...clinic, photos: clinic.photos.filter((p) => p.id !== photoId) }));
}

export function createEnquiry(input: EnquiryInput): Enquiry {
  const enquiry: Enquiry = {
    id: newId(),
    clinic_id: input.clinicId,
    treatment_id: input.treatmentId,
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    preferred_channel: input.channel,
    message: input.message,
    status: "new",
    created_at: new Date().toISOString(),
  };
  modify((data) => ({ ...data, enquiries: [...data.enquiries, enquiry] }));
  return enquiry;
}

export function updateEnquiryStatus(id: string, status: EnquiryStatus): void {
  modify((data) => ({
    ...data,
    enquiries: data.enquiries.map((e) => (e.id === id ? { ...e, status } : e)),
  }));
}

export function resetDemoData(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage is unavailable, so only the in-memory copy needs resetting.
  }
  current = SEED_DATA;
  emit();
}
