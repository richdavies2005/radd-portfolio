"use client";

import { useEffect, useRef, type TouchEvent } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import { RATIO_DIMENSIONS, type WorkImage } from "@/lib/content-types";

interface LightboxProps {
  images: WorkImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const image = images[index];

  useGSAP(
    () => {
      if (!overlayRef.current || !panelRef.current) return;
      if (reducedMotion) {
        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(panelRef.current, { opacity: 1, scale: 1 });
        return;
      }
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" },
      );
    },
    { dependencies: [index], scope: overlayRef },
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, images.length, onClose, onIndexChange]);

  const touchStartX = useRef<number | null>(null);

  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) onIndexChange((index + 1) % images.length);
      else onIndexChange((index - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
  }

  if (!image?.src) return null;
  const dims = RATIO_DIMENSIONS[image.ratio];

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      className="fixed inset-0 z-modal flex items-center justify-center bg-canvas/95 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-modal text-ink transition hover:text-flame-text active:scale-90"
      >
        <X className="h-6 w-6" />
      </button>

      {images.length > 1 && (
        <button
          type="button"
          onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 z-modal -translate-y-1/2 text-ink transition hover:text-flame-text active:scale-90 md:left-6"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      <div ref={panelRef} className="relative flex max-h-[85vh] max-w-4xl flex-col items-center">
        <Image
          src={image.src}
          alt={image.alt}
          width={dims.width}
          height={dims.height}
          className="max-h-[75vh] w-auto object-contain"
          sizes="100vw"
          priority
        />
        {image.caption && (
          <p className="mt-3 font-label text-xs text-ink-muted">{image.caption}</p>
        )}
      </div>

      {images.length > 1 && (
        <button
          type="button"
          onClick={() => onIndexChange((index + 1) % images.length)}
          aria-label="Next image"
          className="absolute right-2 top-1/2 z-modal -translate-y-1/2 text-ink transition hover:text-flame-text active:scale-90 md:right-6"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}
    </div>
  );
}
