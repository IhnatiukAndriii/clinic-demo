"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { isStatus } from "@/lib/enquiry-status";

export async function updateStatus(enquiryId: string, formData: FormData): Promise<void> {
  const { supabase } = await requireUser();
  const status = formData.get("status");
  if (!isStatus(status)) throw new Error("Choose a valid status: new, contacted or closed.");

  const { error } = await supabase.from("enquiries").update({ status }).eq("id", enquiryId);
  if (error) throw new Error(`Could not update the status: ${error.message}`);
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${enquiryId}`);
}
