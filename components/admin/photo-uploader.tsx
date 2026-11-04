"use client";

import { useState } from "react";
import { PhotoError, processPhoto } from "@/lib/photo";
import { dangerButton } from "./styles";

interface NewPhoto {
  key: string;
  name: string;
  src: string;
}

export function PhotoUploader() {
  const [photos, setPhotos] = useState<NewPhoto[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    const added: NewPhoto[] = [];

    for (const file of Array.from(files)) {
      try {
        added.push({ key: crypto.randomUUID(), name: file.name, src: await processPhoto(file) });
      } catch (caught) {
        setError(caught instanceof PhotoError ? caught.message : `${file.name} could not be added.`);
      }
    }

    setPhotos((current) => [...current, ...added]);
    setBusy(false);
  }

  return (
    <div>
      <label htmlFor="photo-files" className="font-medium">Add photos</label>
      <input
        id="photo-files"
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        onChange={(event) => {
          void onFiles(event.target.files);
          event.target.value = "";
        }}
        className="mt-1 block w-full text-sm"
      />
      {busy && <p role="status" className="mt-2 text-sm text-muted">Preparing photos…</p>}
      {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
      {photos.length > 0 && (
        <>
          <ul className="mt-3 space-y-2 text-sm">
            {photos.map((photo) => (
              <li key={photo.key} className="flex items-center gap-3">
                <input type="hidden" name="newPhoto" value={photo.src} />
                {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a browser-held data URL */}
                <img src={photo.src} alt="" className="size-12 rounded-lg object-cover" />
                <span>{photo.name}</span>
                <button type="button" className={dangerButton}
                  onClick={() => setPhotos((current) => current.filter((p) => p.key !== photo.key))}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-muted">Photos are added to the clinic when you save.</p>
        </>
      )}
    </div>
  );
}
