"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Scroll-linked parallax primitives, built on Motion (motion.dev).
 *
 * Division of labour with GSAP (see lib/motion.ts): Motion owns anything
 * tied to scroll position (these primitives); GSAP owns entrance timelines
 * (SplitText hero, reveals). The two never animate the same element — these
 * wrappers add a parent layer around whatever they contain.
 *
 * Both primitives resolve to a static end-state under prefers-reduced-motion,
 * and animate transform only (compositor-friendly, zero layout cost).
 */

interface ParallaxLayerProps {
  /**
   * -1..1 — how far this layer drifts as it crosses the viewport.
   * Positive = foreground (leads the scroll), negative = background (lags).
   * Keep magnitudes ≤ ~0.3 for grid content; this is depth, not a ride.
   */
  depth?: number;
  className?: string;
  children: ReactNode;
}

/** Whole-element depth drift — the layer translates vertically as it crosses the viewport. */
export function ParallaxLayer({ depth = 0.2, className, children }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const amplitude = 80; // px of total drift at |depth| = 1
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [depth * amplitude, -depth * amplitude],
  );

  return (
    <motion.div ref={ref} className={className} style={reduced ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

interface ParallaxImageProps {
  /** 0..~0.12 — fraction of the frame the image drifts. Default 0.08. */
  amount?: number;
  /** Fill an already-sized parent (absolute inset-0) instead of creating a box. */
  fill?: boolean;
  className?: string;
  /** Typically a next/image with `fill` — the frame stays put, the image drifts inside it. */
  children: ReactNode;
}

/**
 * Inner image drift within a clipped frame — the classic editorial parallax.
 * The image is scaled just enough that its edges never enter the frame
 * while it travels.
 */
export function ParallaxImage({
  amount = 0.08,
  fill = false,
  className = "",
  children,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const pct = amount * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`-${pct}%`, `${pct}%`]);
  // Cover the full travel range plus a hair of safety margin.
  const scale = 1 + amount * 2 + 0.02;

  return (
    <div
      ref={ref}
      className={`${fill ? "absolute inset-0" : "relative"} overflow-hidden ${className}`}
    >
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
