import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/** Server-side admin check. Redirects to the login page when nobody is signed in. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return { supabase, user };
}
