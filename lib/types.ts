export interface Treatment {
  id: string;
  slug: string;
  name: string;
  summary: string;
  body: string;
}

export interface ClinicPhoto {
  id?: string;
  storage_path: string;
  sort_order: number;
}

export interface ClinicPrice {
  price_from: number;
  price_to: number | null;
  currency: string;
  price_unit: string;
  inclusions: string[];
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
}

export interface ClinicCardData extends Clinic, ClinicPrice {
  photos: ClinicPhoto[];
}

export interface ClinicTreatmentRow extends ClinicPrice {
  treatment: Pick<Treatment, "id" | "slug" | "name">;
}

export interface ClinicProfile extends Clinic {
  photos: ClinicPhoto[];
  treatments: ClinicTreatmentRow[];
}
