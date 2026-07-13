"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Typewriter } from "@/components/motion/typewriter";

/**
 * Home hero: name in big display type on the left, transparent portrait on
 * the right, both standing on the section's bottom rule (the "distinct
 * break" before the project carousel).
 *
 * Motion split (see components/motion/parallax.tsx): the zoom-blur exit is
 * scroll-linked, so Motion drives it on the outer wrapper — as the section
 * scrolls away the whole composition scales up, blurs, and fades, like the
 * camera pushing through it. GSAP owns the one-time entrance on the inner
 * elements. The two never touch the same node. Both collapse to a static
 * hero under prefers-reduced-motion.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.28]);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 14]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;
      gsap.fromTo(
        sectionRef.current.querySelectorAll("[data-hero-rise]"),
        { autoAlpha: 0, y: 48 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.09,
          clearProps: "transform,opacity,visibility",
        },
      );
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      className="relative h-dvh overflow-hidden border-b border-ink-muted/20 md:h-auto xl:h-dvh"
    >
      {/* Mobile (<md): a top-anchored stack — pt-20 clears the fixed nav, name
          on top, portrait filling the rest down to the break. From md up it's
          the two-column layout: name left, portrait right, both on the break. */}
      <motion.div
        style={reduced ? undefined : { scale, filter, opacity }}
        className="flex h-full flex-col px-3 pt-20 md:grid md:grid-cols-12 md:items-end md:px-6 md:pt-12"
      >
        {/* Name block — top of the stack on mobile, bottom-left from md up. */}
        <div className="relative z-type shrink-0 pb-6 md:col-span-7 md:pb-10">
          <p
            data-hero-rise
            className="font-label text-xs uppercase tracking-wider text-flame-text"
          >
            Communication Design &amp; Photography — Auckland, NZ
          </p>
          {/* Real title stays in the h1 for SEO/screen readers; the visible
              typewriter cycling "Richard Davies." / "Creative Portfolio." is
              decorative (aria-hidden). An invisible sizer reserves the exact
              two-line height of the longest phrase, and the animated text sits
              absolutely on top of it — so however the typing/cursor wraps, it
              can never resize the name block (which would shift the photo on
              mobile or the eyebrow on tablet). */}
          <h1 className="mt-3 font-display font-bold leading-[0.9] tracking-tight text-ink">
            <span className="sr-only">Richard Davies</span>
            <span
              data-hero-rise
              aria-hidden
              className="relative block text-5xl md:text-6xl lg:text-7xl xl:text-10xl"
            >
              <span className="invisible">Creative Portfolio.</span>
              <span className="absolute inset-0">
                <Typewriter
                  texts={["Richard Davies.", "Creative Portfolio."]}
                  periodClassName="text-flame-text"
                />
              </span>
            </span>
          </h1>
        </div>

        {/* Portrait — transparent PNG, always fully shown (object-contain, never
            cropped), anchored to the bottom so it stands on the section break.
            The source is tightly cropped (little headroom), so contain still
            reads large. On mobile it fills the leftover height; on tablet
            (md–xl) the box is aspect-sized to hug the figure in a compact,
            content-height hero; from xl up it's a fixed 78vh column. */}
        <div
          data-hero-rise
          className="relative min-h-0 flex-1 md:col-span-5 md:aspect-[1066/1320] md:h-auto md:flex-none md:self-end xl:aspect-auto xl:h-[78vh]"
        >
          <Image
            src="/hero/portrait.png"
            alt="Richard Davies"
            fill
            priority
            className="object-contain object-bottom"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </div>
      </motion.div>
    </section>
  );
}
