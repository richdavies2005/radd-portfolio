import Image from "next/image";

interface MonogramProps {
  initials?: string;
  /** Once a real headshot exists, pass its src here — this is the only change needed. */
  photoSrc?: string;
  photoAlt?: string;
}

/**
 * Placeholder for the About page portrait: an oversized monogram set as a
 * solid color block, occupying the exact slot a real headshot will use
 * later. Reads as a deliberate brand mark, not a missing-image apology.
 */
export function Monogram({ initials = "RD", photoSrc, photoAlt }: MonogramProps) {
  if (photoSrc) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={photoSrc}
          alt={photoAlt ?? ""}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>
    );
  }

  return (
    <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden bg-flame">
      <span className="font-display text-[8rem] font-bold leading-none text-ink md:text-[10rem]">
        {initials}
      </span>
    </div>
  );
}
