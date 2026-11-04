"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { DEMO_EMAIL, signOut, useIsSignedIn } from "@/lib/demo-auth";
import { secondaryButton } from "./styles";

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const signedIn = useIsSignedIn();

  useEffect(() => {
    if (signedIn === false) router.replace("/admin/login");
  }, [signedIn, router]);

  if (!signedIn) {
    return <p role="status" className="mx-auto max-w-6xl px-6 py-8 text-muted">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <nav aria-label="Admin" className="mb-10 flex flex-wrap items-center gap-6 border-b border-line pb-4">
        <Link href="/admin/clinics" className="font-medium hover:text-accent">Clinics</Link>
        <Link href="/admin/enquiries" className="font-medium hover:text-accent">Quote requests</Link>
        <span className="ml-auto text-sm text-muted">{DEMO_EMAIL}</span>
        <button type="button" className={secondaryButton} onClick={signOut}>Sign out</button>
      </nav>
      {children}
    </div>
  );
}
