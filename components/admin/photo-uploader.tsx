"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { dangerButton } from "./styles";

const BUCKET = "clinic-photos";
const MAX_BYTES = 8 * 1024 * 1024;

function safeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "") || "photo";
}

export function PhotoUploader() {
  const [paths, setPaths] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError(`${file.name} is not an image. Choose JPG, PNG or WebP files.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`${file.name} is larger than 8 MB. Choose a smaller photo.`);
        continue;
      }
      const path = `${crypto.randomUUID()}-${safeName(file.name)}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
      });
      if (uploadError) {
        setError(`${file.name} could not be uploaded: ${uploadError.message}`);
        continue;
      }
      uploaded.push(path);
    }

    setPaths((current) => [...current, ...uploaded]);
    setBusy(false);
  }

  async function remove(path: string) {
    setPaths((current) => current.filter((p) => p !== path));
    await createClient().storage.from(BUCKET).remove([path]);
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
      {busy && <p role="status" className="mt-2 text-sm text-muted">Uploading…</p>}
      {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
      {paths.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm">
          {paths.map((path) => (
            <li key={path} className="flex items-center gap-3">
              <input type="hidden" name="newPhoto" value={path} />
              <span>Uploaded: {path.slice(37)}</span>
              <button type="button" onClick={() => void remove(path)} className={dangerButton}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {paths.length > 0 && (
        <p className="mt-2 text-sm text-muted">Photos are added to the clinic when you save.</p>
      )}
    </div>
  );
}
