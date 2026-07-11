"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { Medium, Ratio, Work } from "@/lib/content-types";

const RATIO_ASPECT: Record<Ratio, string> = {
  wide: "aspect-[16/9]",
  standard: "aspect-[4/3]",
  tall: "aspect-[3/4]",
  square: "aspect-square",
};

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ProjectCarouselProps {
  design: Work[];
  photography: Work[];
}

const TABS: { medium: Medium; label: string }[] = [
  { medium: "graphic-design", label: "Design" },
  { medium: "photography", label: "Photography" },
];

/**
 * Home-page hero: a full-viewport horizontal carousel of project covers with
 * a medium toggle (Graphic design / Photography). Cards curve away from the
 * center like panels on a cylinder — rotateY/scale/opacity driven per-frame
 * by each card's distance from the rail center, under a shared perspective.
 * Clicking a card opens that project; arrows and card focus keep the whole
 * thing keyboard-accessible. All transforms are compositor-only and disabled
 * entirely under prefers-reduced-motion (flat, static row).
 */
export function ProjectCarousel({ design, photography }: ProjectCarouselProps) {
  const [medium, setMedium] = useState<Medium>("graphic-design");
  const [focused, setFocused] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const router = useRouter();

  const works = medium === "graphic-design" ? design : photography;
  const basePath = medium === "graphic-design" ? "/work" : "/photography";

  // Entrance: cards sweep in from the right with a stagger on first load and
  // on each medium toggle. The tween targets an inner wrapper per card
  // ([data-card-inner]) — never the card itself, whose transform/opacity are
  // owned frame-by-frame by the cylinder rAF loop below. Composing the two on
  // separate elements means they can never fight.
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;
      const inners = container.querySelectorAll("[data-card-inner]");
      if (reduced || inners.length === 0) return;
      gsap.fromTo(
        inners,
        { autoAlpha: 0, xPercent: 12 },
        {
          autoAlpha: 1,
          xPercent: 0,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.06,
          clearProps: "transform,opacity,visibility",
        },
      );
    },
    { dependencies: [medium, reduced], scope: containerRef },
  );

  const cardAt = useCallback(
    (i: number) =>
      containerRef.current?.querySelector<HTMLElement>(`[data-card-index="${i}"]`) ?? null,
    [],
  );

  const centerCard = useCallback(
    (i: number, smooth = true) => {
      const container = containerRef.current;
      const el = cardAt(i);
      if (!container || !el) return;
      container.scrollTo({
        left: el.offsetLeft - (container.clientWidth - el.clientWidth) / 2,
        behavior: smooth && !reduced ? "smooth" : "auto",
      });
    },
    [cardAt, reduced],
  );

  // Cylinder math: signed distance from center drives rotateY (sign flips
  // per side), plus a gentle scale/opacity falloff. Direct rAF style writes,
  // transform/opacity only.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const c = container.getBoundingClientRect();
      const center = c.left + c.width / 2;
      let nearest = 0;
      let nearestD = Infinity;

      container.querySelectorAll<HTMLElement>("[data-card-index]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const signed = (r.left + r.width / 2 - center) / (c.width * 0.5);
        const t = Math.max(-1, Math.min(1, signed));
        const d = Math.abs(r.left + r.width / 2 - center);
        if (d < nearestD) {
          nearestD = d;
          nearest = Number(el.dataset.cardIndex);
        }
        if (reduced) {
          el.style.transform = "";
          el.style.opacity = "";
        } else {
          el.style.transform = `rotateY(${(-t * 16).toFixed(2)}deg) scale(${(1 - 0.06 * Math.abs(t)).toFixed(4)})`;
          el.style.opacity = (1 - 0.3 * Math.abs(t)).toFixed(3);
        }
      });

      setFocused((prev) => (prev === nearest ? prev : nearest));
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
  }, [reduced, medium, works.length]);

  // Vertical wheel drives the rail horizontally while it has room; released
  // at both ends so the page never traps scrolling.
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

  // Open on the first card; also re-run when the medium toggles.
  useIsoLayoutEffect(() => {
    setFocused(0);
    centerCard(0, false);
  }, [medium, centerCard]);

  const current = works[focused] ?? works[0];

  return (
    <section
      aria-label="Featured projects"
      className="flex h-dvh flex-col overflow-x-clip pb-2 pt-10"
    >
      {/* Top: brand line + medium toggle, echoing the reference's header strip. */}
      <div className="flex flex-col items-center gap-3 px-3 pb-3">
        {/* Plain <p>: the page's h1 lives in the Hero above this section. */}
        <p className="text-center font-label text-xs uppercase tracking-wider text-ink-muted">
          Richard Davies — Communication Design &amp; Photography
        </p>
        <div role="tablist" aria-label="Project medium" className="flex items-center gap-2">
          {TABS.map((tab) => {
            const active = medium === tab.medium;
            return (
              <button
                key={tab.medium}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMedium(tab.medium)}
                className={`whitespace-nowrap border px-4 py-2 font-label text-xs uppercase tracking-wider transition active:scale-95 ${
                  active
                    ? "border-flame-text text-flame-text"
                    : "border-ink-muted/30 text-ink-muted hover:border-ink hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* The curved rail. Perspective lives on the scroll container so every
          card shares one vanishing point. */}
      <div
        ref={containerRef}
        data-cursor-view="Drag"
        className="no-scrollbar flex min-h-0 flex-1 items-center gap-3 overflow-x-auto py-3 md:gap-4"
        style={{ perspective: "1400px" }}
      >
        <div aria-hidden className="w-[24vw] shrink-0 md:w-[36vw]" />
        {works.map((work, i) => (
          <Link
            key={work.slug}
            href={`${basePath}/${work.slug}`}
            data-card-index={i}
            data-cursor-view="View"
            onFocus={() => centerCard(i)}
            className={`group relative h-full w-auto max-w-[88vw] shrink-0 overflow-hidden ${RATIO_ASPECT[work.coverRatio]}`}
          >
            {/* Entrance-owned wrapper — the GSAP sweep animates this element
                while the rAF cylinder loop owns the card (Link) itself. */}
            <div data-card-inner className="absolute inset-0">
              {work.cover && (
                <Image
                  src={work.cover}
                  alt=""
                  fill
                  priority={i === 0}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(min-width: 768px) 70vw, 90vw"
                />
              )}
              {/* Title scrim keeps the link's purpose visible on touch devices. */}
              <span className="absolute inset-x-0 bottom-0 z-type bg-gradient-to-t from-canvas/95 via-canvas/55 to-transparent p-3">
                <span className="block font-display text-xl font-bold leading-tight text-ink md:text-2xl">
                  {work.title}
                </span>
                <span className="block font-label text-xs uppercase tracking-wider text-ink-muted">
                  {work.year}
                </span>
              </span>
            </div>
          </Link>
        ))}
        <div aria-hidden className="w-[24vw] shrink-0 md:w-[36vw]" />
      </div>

      {/* Bottom: focused-project readout + circular arrows, like the reference. */}
      <div className="flex flex-col items-center gap-1 px-3 pt-1">
        {current && (
          <button
            type="button"
            onClick={() => router.push(`${basePath}/${current.slug}`)}
            className="group text-center"
          >
            <span className="font-display text-xl font-bold leading-tight text-ink transition-colors group-hover:text-flame-text md:text-2xl">
              {current.title}
            </span>
            <span className="ml-3 whitespace-nowrap font-label text-xs uppercase tracking-wider text-ink-muted">
              <span className="text-flame-text">
                {String(focused + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(works.length).padStart(2, "0")}
            </span>
          </button>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => centerCard(focused - 1)}
            disabled={focused === 0}
            aria-label="Previous project"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-ink-muted/40 text-ink transition hover:border-flame-text hover:text-flame-text active:scale-90 disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => centerCard(focused + 1)}
            disabled={focused === works.length - 1}
            aria-label="Next project"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-ink-muted/40 text-ink transition hover:border-flame-text hover:text-flame-text active:scale-90 disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowRight className="h-3 w-3" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
