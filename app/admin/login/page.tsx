import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/admin/clinics");

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="font-display text-3xl font-semibold">Admin sign in</h1>
      <p className="mb-8 mt-2 text-muted">Sign in to manage clinics and quote requests.</p>
      <LoginForm />
    </main>
  );
}
