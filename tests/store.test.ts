import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ClinicInput } from "@/lib/clinic-form";

class MemoryStorage {
  private items = new Map<string, string>();
  quota = Infinity;
  getItem(key: string) {
    return this.items.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    if (value.length > this.quota) throw new DOMException("full", "QuotaExceededError");
    this.items.set(key, value);
  }
  removeItem(key: string) {
    this.items.delete(key);
  }
}

const input: ClinicInput = {
  name: "Test Clinic",
  slug: "test-clinic",
  city: "Hanoi",
  country: "Vietnam",
  description: "A clinic used only in tests.",
  yearsExperience: 3,
  languages: ["English"],
  isPublished: true,
  prices: [
    { tier: "single", priceFrom: 1000, priceTo: null, unit: "per implant", inclusions: ["CT scan"] },
    { tier: "full-arch", priceFrom: 9000, priceTo: 11000, unit: "per jaw", inclusions: ["Prosthesis"] },
  ],
  newPhotos: ["data:image/jpeg;base64,AAAA"],
};

let storage: MemoryStorage;
let store: typeof import("@/lib/store");

beforeEach(async () => {
  vi.resetModules();
  storage = new MemoryStorage();
  vi.stubGlobal("window", { localStorage: storage, addEventListener: () => undefined, removeEventListener: () => undefined });
  store = await import("@/lib/store");
});

describe("demo store", () => {
  it("creates a clinic, persists it and resets to the seed", () => {
    const seedCount = store.readDemoData().clinics.length;
    const clinic = store.createClinic(input);
    expect(clinic.photos).toHaveLength(1);
    expect(JSON.parse(storage.getItem("implants-vietnam-demo-v1")!).clinics).toHaveLength(seedCount + 1);

    store.resetDemoData();
    expect(storage.getItem("implants-vietnam-demo-v1")).toBeNull();
  });

  it("rejects a duplicate web address", () => {
    store.createClinic(input);
    expect(() => store.createClinic(input)).toThrowError(/web address/);
  });

  it("toggles published and removes a clinic", () => {
    const clinic = store.createClinic(input);
    store.setPublished(clinic.id, false);
    expect(store.getClinic(store.readDemoData(), clinic.id)?.is_published).toBe(false);
    store.deleteClinic(clinic.id);
    expect(store.getClinic(store.readDemoData(), clinic.id)).toBeUndefined();
  });

  it("reorders and deletes photos", () => {
    const clinic = store.createClinic({ ...input, newPhotos: ["data:a", "data:b"] });
    const [first, second] = store.sortedPhotos(clinic);
    store.movePhoto(clinic.id, first.id, "down");
    const moved = store.getClinic(store.readDemoData(), clinic.id)!;
    expect(store.sortedPhotos(moved).map((p) => p.id)).toEqual([second.id, first.id]);
    store.deletePhoto(clinic.id, second.id);
    expect(store.getClinic(store.readDemoData(), clinic.id)!.photos).toHaveLength(1);
  });

  it("creates enquiries and updates their status", () => {
    const enquiry = store.createEnquiry({
      clinicId: "clinic-1", treatmentId: "dental-implants", name: "Alex", email: "a@b.co",
      phone: "", channel: "email", message: "Please send a quote.",
    });
    expect(enquiry.status).toBe("new");
    store.updateEnquiryStatus(enquiry.id, "contacted");
    expect(store.getEnquiry(store.readDemoData(), enquiry.id)?.status).toBe("contacted");
  });

  it("reports a clear message and keeps the old data when storage is full", () => {
    storage.quota = 10;
    expect(() => store.createClinic(input)).toThrowError(/no room left/);
    expect(store.getClinic(store.readDemoData(), "test-clinic")).toBeUndefined();
  });

  it("keeps working in memory when storage is unavailable", () => {
    storage.setItem = () => {
      throw new Error("blocked");
    };
    const clinic = store.createClinic(input);
    expect(store.getClinic(store.readDemoData(), clinic.id)).toBeDefined();
  });
});
