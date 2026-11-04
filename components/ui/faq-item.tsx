import type { ReactNode } from "react";

export function FaqItem({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details className="group border-b border-sand-300 py-5 first:border-t">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-control text-lead font-semibold text-brand-900 transition-colors duration-150 hover:text-brand-500 [&::-webkit-details-marker]:hidden">
        {question}
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-transform duration-150 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-3 max-w-prose text-muted">{children}</div>
    </details>
  );
}
