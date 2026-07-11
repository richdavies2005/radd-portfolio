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
      <motion.div
        style={reduced ? undefined : { scale, filter, opacity }}
        className="flex h-full flex-col justify-end px-3 pt-12 md:grid md:grid-cols-12 md:items-end md:px-6"
      >
        {/* Name block — bottom-left, sitting on the break line. */}
        <div className="relative z-type pb-6 md:col-span-7 md:pb-10">
          <p
            data-hero-rise
            className="font-label text-xs uppercase tracking-wider text-flame-text"
          >
            Communication Design &amp; Photography — Auckland, NZ
          </p>
          <h1 className="mt-3 font-display font-bold leading-[0.9] tracking-tight text-ink">
            <span data-hero-rise className="block text-9xl md:text-10xl">
              Richard
            </span>
            <span data-hero-rise className="block text-9xl md:text-10xl">
              Davies
            </span>
          </h1>
          <p
            data-hero-rise
            className="mt-4 font-label text-xs uppercase tracking-wider text-ink-muted"
          >
            Selected work below
          </p>
        </div>

        {/* Portrait — transparent PNG, feet on the section break. */}
        <div
          data-hero-rise
          className="relative h-[42vh] shrink-0 md:col-span-5 md:h-[78vh] md:self-end"
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
