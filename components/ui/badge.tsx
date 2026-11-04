import type { ReactNode } from "react";

export type BadgeTone = "teal" | "sand" | "onPhoto";

const tones: Record<BadgeTone, string> = {
  teal: "bg-brand-50 text-brand-700",
  sand: "bg-sand-100 text-ink",
  onPhoto: "bg-white/95 text-brand-700 shadow-card",
};

export function Badge({ tone = "teal", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-caption font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
