"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Lightbox } from "./lightbox";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { Ratio, WorkImage } from "@/lib/content-types";

const RATIO_ASPECT: Record<Ratio, string> = {
  wide: "aspect-[16/9]",
  standard: "aspect-[4/3]",
  tall: "aspect-[3/4]",
  square: "aspect-square",
};

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface FocusRailProps {
  images: WorkImage[];
  /** Photography: click/tap an image to open it in the lightbox. */
  enableLightbox?: boolean;
  /** Small eyebrow above the intro blurb. */
  introLabel?: string;
  /** The intro blurb itself — replace the placeholder when the real copy exists. */
  introText?: string;
}

const PLACEHOLDER_INTRO =
  "Placeholder — a short blurb about this shoot goes here. Write about where it was made, the light you were chasing, and how it came together. This panel scrolls with the images; replace this copy when you're ready.";

/**
 * Horizontal focus gallery. Images (and a leading intro blurb) scale toward
 * full size as they approach the viewport center and shrink as the next one
 * takes focus. Free native scrolling (touch/trackpad), vertical wheel mapped
 * to horizontal while the rail can still consume it (released at both ends so
 * the page never gets trapped), arrow buttons for keyboard access.
 *
 * The intro blurb is a true member of the sequence — it lives to the left of
 * the first image and moves/scales exactly like an image, so scrolling left
 * brings it into focus to read.
 *
 * Element lookups go through data attributes queried live from the DOM rather
 * than a mutable ref array — that keeps the focus math correct across React's
 * dev double-mount and HMR, where a ref array can fall out of sync. Scale and
 * opacity are transform/opacity only, skipped entirely under reduced motion.
 */
export function FocusRail({
  images,
  enableLightbox = false,
  introLabel = "The shoot",
  introText = PLACEHOLDER_INTRO,
}: FocusRailProps) {
  const valid = images.filter((img): img is WorkImage & { src: string } => Boolean(img.src));
  const containerRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(0);
  const [introFocused, setIntroFocused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const imageAt = (i: number) =>
    containerRef.current?.querySelector<HTMLElement>(`[data-rail-index="${i}"]`) ?? null;
  const introEl = () =>
    containerRef.current?.querySelector<HTMLElement>("[data-rail-intro]") ?? null;

  // Per-frame focus math over the rail's live members. The nearest-to-center
  // element wins; images report their index, the intro reports itself.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const c = container.getBoundingClientRect();
      const center = c.left + c.width / 2;
      const items = container.querySelectorAll<HTMLElement>("[data-rail-item]");

      let nearest: HTMLElement | null = null;
      let nearestD = Infinity;

      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - center);
        if (d < nearestD) {
          nearestD = d;
          nearest = el;
        }
        if (reduced) {
          el.style.transform = "";
          el.style.opacity = "";
        } else {
          const t = Math.min(d / (c.width * 0.55), 1);
          el.style.transform = `scale(${1 - 0.16 * t})`;
          el.style.opacity = String(1 - 0.35 * t);
        }
      });

      if (nearest) {
        const el = nearest as HTMLElement;
        const isIntro = el.hasAttribute("data-rail-intro");
        setIntroFocused((prev) => (prev === isIntro ? prev : isIntro));
        if (!isIntro) {
          const idx = Number(el.dataset.railIndex);
          setFocused((prev) => (prev === idx ? prev : idx));
        }
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    schedule();
    container.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      container.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, valid.length]);

  // Vertical wheel drives the rail horizontally while it has room to move;
  // at either end the event passes through so the page scrolls normally.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = container.scrollWidth - container.clientWidth;
      const atStart = container.scrollLeft <= 1 && e.deltaY < 0;
      const atEnd = container.scrollLeft >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd || max <= 0) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  const centerEl = useCallback(
    (el: HTMLElement | null, smooth = true) => {
      const container = containerRef.current;
      if (!container || !el) return;
      container.scrollTo({
        left: el.offsetLeft - (container.clientWidth - el.clientWidth) / 2,
        behavior: smooth && !reduced ? "smooth" : "auto",
      });
    },
    [reduced],
  );

  // Open on the first image, with the blurb resting to its left. The rail
  // sits below the case-study header (off-screen at load), so this initial
  // positioning is never visible as a jump.
  useIsoLayoutEffect(() => {
    centerEl(imageAt(0), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (valid.length === 0) return null;
  const caption = valid[focused]?.caption;
  // Prev from the first image reaches the blurb; the blurb itself is the left end.
  const prevDisabled = introFocused;
  const nextDisabled = !introFocused && focused === valid.length - 1;

  const goPrev = () => {
    if (introFocused) return;
    centerEl(focused === 0 ? introEl() : imageAt(focused - 1));
  };
  const goNext = () => {
    centerEl(introFocused ? imageAt(0) : imageAt(focused + 1));
  };

  return (
    <section aria-label="Project gallery" className="py-8 md:py-12">
      <div
        ref={containerRef}
        data-cursor-view="Drag"
        className="no-scrollbar flex items-center gap-3 overflow-x-auto md:gap-6"
      >
        {/* Spacer lets the intro blurb reach the center when scrolled fully left. */}
        <div aria-hidden className="w-[20vw] shrink-0 md:w-[34vw]" />

        {/* Intro blurb — leftmost member of the sequence, scrolls/scales like an image. */}
        <div
          data-rail-item
          data-rail-intro
          className="flex h-[46vh] w-[78vw] shrink-0 flex-col justify-center pr-4 md:h-[62vh] md:w-[30rem] md:pr-10"
        >
          <p className="font-label text-xs uppercase tracking-wider text-flame-text">
            {introLabel}
          </p>
          <p className="mt-4 font-body text-lg leading-relaxed text-ink-muted md:text-xl">
            {introText}
          </p>
          <span aria-hidden className="mt-6 h-px w-16 bg-flame-text" />
        </div>

        {valid.map((img, i) => {
          const shared = `relative h-[46vh] shrink-0 overflow-hidden md:h-[62vh] ${RATIO_ASPECT[img.ratio]}`;
          const picture = (
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="(min-width: 768px) 80vw, 95vw"
            />
          );
          return enableLightbox ? (
            <button
              key={img.src}
              data-rail-item
              data-rail-index={i}
              type="button"
              onClick={() => setLightboxIndex(i)}
              onFocus={() => centerEl(imageAt(i))}
              aria-label={`Open ${img.alt} in lightbox`}
              data-cursor-view="View"
              className={shared}
            >
              {picture}
            </button>
          ) : (
            <figure key={img.src} data-rail-item data-rail-index={i} className={shared}>
              {picture}
            </figure>
          );
        })}
        <div aria-hidden className="w-[20vw] shrink-0 md:w-[34vw]" />
      </div>

      {/* Counter, caption, and keyboard-accessible controls. */}
      <div className="mt-4 flex items-center justify-between gap-4 px-3 md:mt-6 md:px-6">
        <p data-rail-counter className="font-label text-xs uppercase tracking-wider text-ink-muted">
          {introFocused ? (
            <span className="text-flame-text">{introLabel}</span>
          ) : (
            <>
              <span className="text-flame-text">
                {String(focused + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(valid.length).padStart(2, "0")}
              {caption && <span className="ml-4 normal-case">{caption}</span>}
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={prevDisabled}
            aria-label="Previous"
            className="flex h-6 w-6 items-center justify-center border border-ink-muted/30 text-ink transition hover:border-flame-text hover:text-flame-text active:scale-90 disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={nextDisabled}
            aria-label="Next"
            className="flex h-6 w-6 items-center justify-center border border-ink-muted/30 text-ink transition hover:border-flame-text hover:text-flame-text active:scale-90 disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowRight className="h-3 w-3" aria-hidden />
          </button>
        </div>
      </div>

      {enableLightbox && lightboxIndex !== null && (
        <Lightbox
          images={valid}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </section>
  );
}
