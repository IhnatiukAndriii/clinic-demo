"use client";

import { useState } from "react";
import type { PriceValues } from "@/lib/clinic-form";
import { dangerButton, inputClass, secondaryButton } from "./styles";

interface Props {
  treatmentId: string;
  treatmentName: string;
  initial: PriceValues;
  error?: string;
}

export function PriceRow({ treatmentId, treatmentName, initial, error }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [inclusions, setInclusions] = useState<string[]>(initial.inclusions);
  const [draft, setDraft] = useState("");
  const key = `price:${treatmentId}`;
  const errorId = `${key}-error`;

  function addInclusion() {
    const value = draft.trim();
    if (!value || inclusions.includes(value)) return;
    setInclusions([...inclusions, value]);
    setDraft("");
  }

  return (
    <fieldset className="rounded-xl border border-line bg-surface p-5">
      <legend className="px-2 font-semibold">{treatmentName}</legend>
      <label className="flex items-center gap-2 font-medium">
        <input type="checkbox" name={`${key}:enabled`} checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)} className="size-4 accent-accent" />
        This clinic offers {treatmentName.toLowerCase()}
      </label>

      {enabled && (
        <div className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label htmlFor={`${key}-from`} className="font-medium">Price from</label>
              <input id={`${key}-from`} name={`${key}:from`} inputMode="decimal" defaultValue={initial.from}
                aria-invalid={!!error} aria-describedby={error ? errorId : undefined} className={inputClass} />
            </div>
            <div>
              <label htmlFor={`${key}-to`} className="font-medium">
                Price up to <span className="font-normal text-muted">(optional)</span>
              </label>
              <input id={`${key}-to`} name={`${key}:to`} inputMode="decimal" defaultValue={initial.to}
                aria-invalid={!!error} className={inputClass} />
            </div>
            <div>
              <label htmlFor={`${key}-currency`} className="font-medium">Currency</label>
              <input id={`${key}-currency`} name={`${key}:currency`} defaultValue={initial.currency}
                maxLength={3} className={inputClass} />
            </div>
            <div>
              <label htmlFor={`${key}-unit`} className="font-medium">Price is</label>
              <input id={`${key}-unit`} name={`${key}:unit`} defaultValue={initial.unit}
                placeholder="per implant" className={inputClass} />
            </div>
          </div>
          {error && <p id={errorId} className="text-sm text-danger">{error}</p>}

          <div>
            <p className="font-medium">What is included</p>
            {inclusions.length === 0 && <p className="mt-1 text-sm text-muted">Nothing added yet.</p>}
            <ul className="mt-2 space-y-2">
              {inclusions.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <input type="hidden" name={`${key}:inclusion`} value={item} />
                  <span>{item}</span>
                  <button type="button" className={dangerButton}
                    onClick={() => setInclusions(inclusions.filter((i) => i !== item))}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <input aria-label={`New inclusion for ${treatmentName}`} value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addInclusion();
                  }
                }}
                placeholder="For example: Airport transfer" className={inputClass + " mt-0"} />
              <button type="button" onClick={addInclusion} className={secondaryButton + " shrink-0"}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
}
