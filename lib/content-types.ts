export type Medium = "graphic-design" | "photography";
export type Ratio = "wide" | "standard" | "tall" | "square";
export type AccentColor = "flame" | "cobalt" | "acid";
export type ImageWeight = "hero" | "large" | "medium" | "small";
export type OverlapHint = "none" | "text" | "image";

export interface WorkImage {
  src?: string;
  alt: string;
  caption?: string;
  ratio: Ratio;
  weight: ImageWeight;
  overlap: OverlapHint;
}

/** Intrinsic pixel dimensions matching each ratio — used wherever next/image
 * needs explicit width/height instead of `fill` (e.g. the lightbox), so
 * placeholder and real images share one aspect-ratio contract. */
export const RATIO_DIMENSIONS: Record<Ratio, { width: number; height: number }> = {
  wide: { width: 1600, height: 900 },
  standard: { width: 1200, height: 900 },
  tall: { width: 900, height: 1200 },
  square: { width: 1000, height: 1000 },
};

export interface Work {
  slug: string;
  title: string;
  medium: Medium;
  year: string;
  summary: string;
  tags: string[];
  featured: boolean;
  accentColor: AccentColor;
  cover?: string;
  coverRatio: Ratio;
  /** Optional override for the detail-page header image (filename in the
   * project folder). Falls back to cover / a landscape frame when absent. */
  headerImage?: string;
  role?: string;
  tools?: string[];
  images: WorkImage[];
  order?: number;
  /** Blurb shown in the panel to the left of the gallery images. */
  blurb?: string;
  /** Small eyebrow above that blurb (e.g. "The shoot", "The project"). */
  blurbLabel?: string;
}
