"use client";

import { useEffect, useState } from "react";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True when the user has requested reduced motion at the OS level. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True only for devices with an accurate pointer and hover (desktop mice/trackpads).
 *  Cursor-follow, magnetic, and tilt effects are gated on this — touch devices never get them. */
export function usePointerFine(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** True only when it's safe to run the "full" motion layer: fine pointer AND no reduced-motion request. */
export function useFullMotion(): boolean {
  const pointerFine = usePointerFine();
  const reducedMotion = usePrefersReducedMotion();
  return pointerFine && !reducedMotion;
}

export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
} as const;
