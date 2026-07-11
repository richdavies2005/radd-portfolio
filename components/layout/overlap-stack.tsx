import type { ReactNode } from "react";

interface OverlapStackProps {
  className?: string;
  children: ReactNode;
}

/**
 * Stacks children in the same grid cell so they can genuinely overlap.
 * `grid-template-areas` (see Section/Area) can only tile non-overlapping
 * rectangles per spec — real pixel overlap needs every child sharing one
 * cell, each sized/positioned independently, stacked via the z-index
 * token scale. Use this for hero/case-study moments where an image and
 * headline deliberately intersect; use Section/Area for asymmetric-but-
 * tiled compositions (index grids, varied column spans) that don't overlap.
 */
/** Overlap is a md+ treatment — below md, layers stack in flow so type never
 *  sits on unscrimmed imagery at small sizes. */
export function OverlapStack({ className = "", children }: OverlapStackProps) {
  return <div className={`flex flex-col gap-3 md:grid ${className}`}>{children}</div>;
}

interface OverlapItemProps {
  className?: string;
  children: ReactNode;
}

/** A single layer within an <OverlapStack> — combine with a z-* token class for stacking order. */
export function OverlapItem({ className = "", children }: OverlapItemProps) {
  return <div className={`relative md:[grid-area:1/1] ${className}`}>{children}</div>;
}
