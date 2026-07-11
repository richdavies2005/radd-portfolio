"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useFullMotion } from "@/lib/motion";

/** Subtle 3D tilt tracking the pointer within the element. Pointer-fine + full-motion only. */
export function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const fullMotion = useFullMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !fullMotion) return;

    gsap.set(el, { transformPerspective: 800 });
    const rotateX = gsap.quickTo(el, "rotateX", { duration: 0.4, ease: "power3" });
    const rotateY = gsap.quickTo(el, "rotateY", { duration: 0.4, ease: "power3" });

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY(px * 8);
      rotateX(-py * 8);
    }
    function onLeave() {
      rotateX(0);
      rotateY(0);
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [fullMotion]);

  return ref;
}
