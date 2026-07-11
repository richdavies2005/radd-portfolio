"use client";

import type { ReactNode } from "react";
import { useTilt } from "./use-tilt";

interface TiltWrapperProps {
  className?: string;
  children: ReactNode;
}

/** Wraps server-rendered card content with pointer-driven 3D tilt. */
export function TiltWrapper({ className = "", children }: TiltWrapperProps) {
  const ref = useTilt<HTMLDivElement>();
  return (
    <div ref={ref} className={`[transform-style:preserve-3d] ${className}`}>
      {children}
    </div>
  );
}
