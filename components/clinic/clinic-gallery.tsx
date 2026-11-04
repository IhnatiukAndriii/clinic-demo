"use client";

import Image from "next/image";
import { useState } from "react";
import type { ClinicPhoto } from "@/lib/types";

interface Props {
  photos: ClinicPhoto[];
  name: string;
}

export function ClinicGallery({ photos, name }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[3/2] items-center justify-center rounded-panel bg-brand-50 text-muted">
        Photos coming soon
      </div>
    );
  }

  const selected = photos.find((photo) => photo.id === selectedId) ?? photos[0];
  const position = photos.indexOf(selected) + 1;

  return (
    <div>
      <div className="relative aspect-[3/2] overflow-hidden rounded-panel bg-brand-50 shadow-card">
        <Image
          key={selected.id}
          src={selected.src}
          alt={`${name}, photo ${position} of ${photos.length}`}
          fill
          priority
          sizes="(min-width: 1152px) 720px, (min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>
      {photos.length > 1 ? (
        <ul className="mt-3 grid grid-cols-4 gap-3" aria-label="Choose a photo">
          {photos.map((photo, index) => {
            const active = photo.id === selected.id;
            return (
              <li key={photo.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(photo.id)}
                  aria-label={`Show photo ${index + 1} of ${photos.length}`}
                  aria-pressed={active}
                  className={`relative block aspect-[3/2] w-full overflow-hidden rounded-control border-2 transition-colors duration-150 ${
                    active ? "border-brand-600" : "border-transparent hover:border-brand-200"
                  }`}
                >
                  <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 160px, 25vw" className="object-cover" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
