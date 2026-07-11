"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

interface ColorBlockRevealProps {
  className?: string;
  children: ReactNode;
}

/** Reveals a themed color-block header via a clip-path wipe rather than a plain fade. */
export function ColorBlockReveal({ className = "", children }: ColorBlockRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      if (reducedMotion) {
        gsap.set(ref.current, { clipPath: "inset(0 0 0% 0)" });
        return;
      }
      gsap.fromTo(
        ref.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power3.inOut" },
      );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <header ref={ref} className={className}>
      {children}
    </header>
  );
}
