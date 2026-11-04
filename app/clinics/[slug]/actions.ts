"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { parseEnquiry, type EnquiryErrors } from "@/lib/enquiry";

export interface EnquiryState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: EnquiryErrors;
  values?: Record<string, string>;
}

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const result = parseEnquiry(formData);
  if (!result.ok) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and send again.",
      errors: result.errors,
      values: { ...result.value },
    };
  }

  const { value } = result;
  const { error } = await createPublicClient().from("enquiries").insert({
    clinic_id: value.clinicId,
    treatment_id: value.treatmentId,
    name: value.name,
    email: value.email,
    phone: value.phone || null,
    preferred_channel: value.channel,
    message: value.message,
  });

  if (error) {
    return {
      status: "error",
      message: "We could not send your request. Please try again in a moment.",
      values: { ...value },
    };
  }
  return { status: "success" };
}
