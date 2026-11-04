import type { Channel } from "./enquiry";
import type { EnquiryStatus } from "./enquiry-status";

export type Tier = "single" | "full-arch";

export interface Treatment {
  id: string;
  slug: string;
  name: string;
  summary: string;
  body: string;
}

export interface ClinicTreatment {
  treatment_id: string;
  tier: Tier;
  price_from: number;
  price_to: number | null;
  currency: "AUD";
  price_unit: string;
  inclusions: string[];
}

export interface ClinicPhoto {
  id: string;
  /** A path under /public or a data URL for photos uploaded in the browser. */
  src: string;
  sort_order: number;
}

export interface Clinic {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  description: string;
  years_experience: number | null;
  languages: string[];
  is_published: boolean;
  photos: ClinicPhoto[];
  treatments: ClinicTreatment[];
}

export interface Enquiry {
  id: string;
  clinic_id: string;
  treatment_id: string;
  name: string;
  email: string;
  phone: string | null;
  preferred_channel: Channel;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}

export interface DemoData {
  clinics: Clinic[];
  enquiries: Enquiry[];
}
