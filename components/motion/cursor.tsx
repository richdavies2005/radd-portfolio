"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useFullMotion } from "@/lib/motion";

/**
 * Custom cursor: a plain solid-red dot that tracks the pointer 1:1 and grows
 * slightly over interactive elements. Uses event delegation (not a queried
 * element list) so it keeps working across client-side route changes without
 * re-binding per page. Only mounts for full-motion users (fine pointer, no
 * reduced-motion request) — see lib/motion.ts.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const fullMotion = useFullMotion();

  useEffect(() => {
    if (!fullMotion || !dotRef.current) return;
    const dot = dotRef.current;

    document.body.classList.add("cursor-none-fine");

    function onMove(e: MouseEvent) {
      // Track the pointer 1:1 with no easing/lag — the dot sits exactly under
      // the cursor rather than trailing it.
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    }

    function onOver(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest?.("[data-cursor-view], a, button");
      if (!target) return;
      gsap.to(dot, { scale: 1.8, duration: 0.25, ease: "power3.out" });
    }

    function onOut(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest?.("[data-cursor-view], a, button");
      if (!target) return;
      gsap.to(dot, { scale: 1, duration: 0.25, ease: "power3.out" });
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);

    return () => {
      document.body.classList.remove("cursor-none-fine");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      gsap.killTweensOf(dot);
    };
  }, [fullMotion]);

  if (!fullMotion) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-cursor h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/60"
    />
  );
}
