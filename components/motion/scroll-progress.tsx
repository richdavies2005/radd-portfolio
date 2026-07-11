"use client";

import { motion, useScroll } from "motion/react";

/**
 * Thin flame line under the nav showing page scroll progress. Scroll-linked
 * position feedback (conveys meaning), so it stays active under
 * reduced-motion — it only ever mirrors the user's own scrolling.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-nav h-[2px] origin-left bg-flame-text"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
