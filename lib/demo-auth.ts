import { useSyncExternalStore } from "react";

/** Demo login only. These values are visible in the browser and protect nothing. */
export const DEMO_EMAIL = "demo@implants.example";
export const DEMO_PASSWORD = "demo-admin-2026";

const SESSION_KEY = "implants-demo-admin";
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return memorySession;
  }
}

let memorySession = false;

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function signIn(email: string, password: string): boolean {
  if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) return false;
  memorySession = true;
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // The in-memory flag keeps this tab signed in when sessionStorage is blocked.
  }
  emit();
  return true;
}

export function signOut(): void {
  memorySession = false;
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing stored, nothing to remove.
  }
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** `null` while the server snapshot is in use, so callers can wait for hydration. */
export function useIsSignedIn(): boolean | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
