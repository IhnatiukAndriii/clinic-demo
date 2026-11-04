"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  readClinicForm,
  validateClinic,
  type ClinicErrors,
  type ClinicFormValues,
  type ClinicInput,
} from "@/lib/clinic-form";

export interface ClinicFormState {
  message?: string;
  errors?: ClinicErrors;
  values?: ClinicFormValues;
}

const BUCKET = "clinic-photos";
const UNIQUE_VIOLATION = "23505";

function revalidatePublicPages(): void {
  revalidatePath("/treatments/[slug]", "page");
  revalidatePath("/clinics/[slug]", "page");
  revalidatePath("/admin/clinics");
}

type Supabase = Awaited<ReturnType<typeof requireUser>>["supabase"];

async function writeClinicRow(
  supabase: Supabase,
  clinicId: string | null,
  input: ClinicInput,
): Promise<{ id: string } | { error: string; field?: string }> {
  const row = {
    slug: input.slug,
    name: input.name,
    city: input.city,
    country: input.country,
    description: input.description,
    years_experience: input.yearsExperience,
    languages: input.languages,
    is_published: input.isPublished,
  };

  const query = clinicId
    ? supabase.from("clinics").update(row).eq("id", clinicId).select("id").single()
    : supabase.from("clinics").insert(row).select("id").single();
  const { data, error } = await query;

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return { error: "Another clinic already uses this web address. Change the web address.", field: "slug" };
    }
    return { error: `The clinic could not be saved: ${error.message}` };
  }
  return { id: (data as { id: string }).id };
}

async function writePrices(supabase: Supabase, clinicId: string, input: ClinicInput): Promise<string | null> {
  const keep = input.prices.map((p) => p.treatmentId);
  const removal = supabase.from("clinic_treatments").delete().eq("clinic_id", clinicId);
  const { error: deleteError } = keep.length
    ? await removal.not("treatment_id", "in", `(${keep.join(",")})`)
    : await removal;
  if (deleteError) return deleteError.message;

  if (keep.length === 0) return null;
  const { error } = await supabase.from("clinic_treatments").upsert(
    input.prices.map((p) => ({
      clinic_id: clinicId,
      treatment_id: p.treatmentId,
      price_from: p.priceFrom,
      price_to: p.priceTo,
      currency: p.currency,
      price_unit: p.unit,
      inclusions: p.inclusions,
    })),
    { onConflict: "clinic_id,treatment_id" },
  );
  return error ? error.message : null;
}

async function writePhotos(supabase: Supabase, clinicId: string, paths: string[]): Promise<string | null> {
  if (paths.length === 0) return null;
  const { data } = await supabase
    .from("clinic_photos")
    .select("sort_order")
    .eq("clinic_id", clinicId)
    .order("sort_order", { ascending: false })
    .limit(1);
  const start = (data?.[0]?.sort_order ?? -1) + 1;
  const { error } = await supabase.from("clinic_photos").insert(
    paths.map((storage_path, index) => ({ clinic_id: clinicId, storage_path, sort_order: start + index })),
  );
  return error ? error.message : null;
}

export async function saveClinic(
  clinicId: string | null,
  _prev: ClinicFormState,
  formData: FormData,
): Promise<ClinicFormState> {
  const { supabase } = await requireUser();

  const { data: treatments } = await supabase.from("treatments").select("id");
  const values = readClinicForm(formData, (treatments ?? []).map((t) => t.id as string));
  const parsed = validateClinic(values);
  if (!parsed.ok) {
    return { message: "Some details need fixing. Check the highlighted fields.", errors: parsed.errors, values };
  }

  const saved = await writeClinicRow(supabase, clinicId, parsed.input);
  if ("error" in saved) {
    return {
      message: saved.error,
      errors: saved.field ? { [saved.field]: saved.error } : undefined,
      values,
    };
  }

  const failure =
    (await writePrices(supabase, saved.id, parsed.input)) ??
    (await writePhotos(supabase, saved.id, parsed.input.newPhotos));
  if (failure) {
    return { message: `The clinic was saved, but prices or photos failed: ${failure}`, values };
  }

  revalidatePublicPages();
  redirect(`/admin/clinics/${saved.id}?saved=1`);
}

export async function setPublished(clinicId: string, publish: boolean): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("clinics").update({ is_published: publish }).eq("id", clinicId);
  if (error) throw new Error(`Could not change published status: ${error.message}`);
  revalidatePublicPages();
}

export async function deletePhoto(clinicId: string, photoId: string): Promise<void> {
  const { supabase } = await requireUser();
  const { data: photo } = await supabase
    .from("clinic_photos")
    .select("storage_path")
    .eq("id", photoId)
    .eq("clinic_id", clinicId)
    .maybeSingle();
  if (!photo) return;

  const { error } = await supabase.from("clinic_photos").delete().eq("id", photoId);
  if (error) throw new Error(`Could not delete photo: ${error.message}`);
  await supabase.storage.from(BUCKET).remove([photo.storage_path as string]);
  revalidatePublicPages();
  revalidatePath(`/admin/clinics/${clinicId}`);
}

export async function movePhoto(clinicId: string, photoId: string, direction: "up" | "down"): Promise<void> {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("clinic_photos")
    .select("id")
    .eq("clinic_id", clinicId)
    .order("sort_order")
    .order("id");
  const ids = (data ?? []).map((p) => p.id as string);
  const index = ids.indexOf(photoId);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= ids.length) return;

  [ids[index], ids[target]] = [ids[target], ids[index]];
  const results = await Promise.all(
    ids.map((id, order) => supabase.from("clinic_photos").update({ sort_order: order }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(`Could not reorder photos: ${failed.error.message}`);
  revalidatePublicPages();
  revalidatePath(`/admin/clinics/${clinicId}`);
}
