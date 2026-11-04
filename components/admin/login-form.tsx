"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/admin/login/actions";
import { inputClass, primaryButton } from "./styles";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p role="alert" className="rounded-lg border border-danger p-3 text-danger">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="font-medium">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required
          defaultValue={state.email} className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="font-medium">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required
          className={inputClass} />
      </div>
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
