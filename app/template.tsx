"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Next.js re-mounts template.tsx on every navigation (unlike layout.tsx),
 * which makes it the right place for a page-transition wipe. Reduced-motion
 * skips the wipe entirely and shows content immediately — no stuck overlay.
 */
export default function Template({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!contentRef.current || !wipeRef.current) return;

      // Skip the wipe under reduced motion, and in hidden/background tabs —
      // rAF is paused there, so a timeline would freeze at its first frame
      // (full-screen wipe) until the tab is foregrounded.
      if (reducedMotion || document.hidden) {
        gsap.set(contentRef.current, { opacity: 1 });
        gsap.set(wipeRef.current, { display: "none" });
        return;
      }

      gsap.set(contentRef.current, { opacity: 0 });
      const tl = gsap.timeline();
      tl.set(wipeRef.current, { display: "block", scaleY: 1, transformOrigin: "top" })
        .to(wipeRef.current, {
          scaleY: 0,
          transformOrigin: "bottom",
          duration: 0.5,
          ease: "power3.inOut",
        })
        .set(contentRef.current, { opacity: 1 }, "-=0.15")
        .set(wipeRef.current, { display: "none" });
    },
    { scope: contentRef, dependencies: [reducedMotion] },
  );

  // Failsafe: GSAP drives the wipe via rAF, which browsers pause in hidden
  // tabs. If the timeline hasn't finished shortly after mount, force the end
  // state with direct style writes (deliberately not gsap.set, so nothing can
  // re-order around it) — the page must never stay hidden behind the wipe.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (contentRef.current) contentRef.current.style.opacity = "1";
      if (wipeRef.current) wipeRef.current.style.display = "none";
    }, 1500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="relative">
      <div
        ref={wipeRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-modal bg-flame"
        style={{ display: "none" }}
      />
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
