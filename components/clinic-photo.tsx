import Image from "next/image";
import { photoUrl } from "@/lib/format";
import type { ClinicPhoto } from "@/lib/types";

interface Props {
  photo: ClinicPhoto | undefined;
  name: string;
  sizes: string;
  priority?: boolean;
}

export function ClinicPhotoImage({ photo, name, sizes, priority }: Props) {
  if (!photo) {
    return (
      <div
        role="img"
        aria-label={`No photo yet for ${name}`}
        className="flex h-full w-full items-center justify-center bg-accent-soft font-display text-5xl text-accent"
      >
        {name.charAt(0)}
      </div>
    );
  }
  return (
    <Image
      src={photoUrl(photo.storage_path)}
      alt={`${name} clinic`}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  );
}
