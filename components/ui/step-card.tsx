import type { ReactNode } from "react";

interface Props {
  step: number;
  title: string;
  children: ReactNode;
}

export function StepCard({ step, title, children }: Props) {
  return (
    <li className="flex gap-5">
      <span
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display text-title font-semibold text-white"
      >
        {step}
      </span>
      <div>
        <h3 className="text-title text-brand-900">
          <span className="sr-only">Step {step}: </span>
          {title}
        </h3>
        <p className="mt-2 text-muted">{children}</p>
      </div>
    </li>
  );
}
