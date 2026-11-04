export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_PHOTO_EDGE = 1200;
export const PHOTO_QUALITY = 0.8;

export class PhotoError extends Error {}

/** Size that fits within `maxEdge` on the long side, never enlarging. */
export function fitWithin(width: number, height: number, maxEdge: number): { width: number; height: number } {
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new PhotoError("The photo could not be read. Try a different file."));
    reader.readAsDataURL(blob);
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new PhotoError("This file could not be opened as a photo. Use a JPG, PNG or WebP file."));
    image.src = url;
  });
}

/** Validates, downsizes to 1200px on the long side and re-encodes as a JPEG data URL. */
export async function processPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new PhotoError(`${file.name} is not an image. Choose JPG, PNG or WebP files.`);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new PhotoError(`${file.name} is larger than 5 MB. Choose a smaller photo.`);
  }

  const image = await loadImage(await readAsDataUrl(file));
  const { width, height } = fitWithin(image.naturalWidth, image.naturalHeight, MAX_PHOTO_EDGE);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new PhotoError("This browser cannot resize photos. Try a different browser.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", PHOTO_QUALITY);
}
