"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { signIn, useIsSignedIn } from "@/lib/demo-auth";
import { inputClass, primaryButton } from "./styles";

export function LoginForm() {
  const router = useRouter();
  const signedIn = useIsSignedIn();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (signedIn) router.replace("/admin/clinics");
  }, [signedIn, router]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (!signIn(email, password)) {
      setError("That email and password do not match. Check them and try again.");
      return;
    }
    router.replace("/admin/clinics");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <p role="alert" className="rounded-lg border border-danger p-3 text-danger">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="font-medium">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required
          value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="font-medium">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required
          className={inputClass} />
      </div>
      <button type="submit" className={primaryButton}>Sign in</button>
    </form>
  );
}
