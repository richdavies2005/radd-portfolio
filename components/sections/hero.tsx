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
      className="relative h-dvh overflow-hidden border-b border-ink-muted/20"
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
          <h1 className="mt-3 font-display font-bold leading-[0.9] tracking-tight text-ink">
            <span data-hero-rise className="block text-9xl lg:text-10xl">
              Richard
            </span>
            <span data-hero-rise className="block text-9xl lg:text-10xl">
              Davies
            </span>
          </h1>
        </div>

        {/* Portrait — transparent PNG, feet on the section break. On mobile it
            fills the leftover height and covers the full width (object-cover
            clips the empty transparent band above the cap, so the figure reads
            large); from md up it's a fixed 78vh column, contained. */}
        <div
          data-hero-rise
          className="relative min-h-0 flex-1 md:col-span-5 md:h-[78vh] md:flex-none md:self-end"
        >
          <Image
            src="/hero/portrait.png"
            alt="Richard Davies"
            fill
            priority
            className="object-cover object-bottom md:object-contain"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </div>
      </motion.div>
    </section>
  );
}
