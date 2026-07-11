import type { ElementType, ReactNode } from "react";
import type { AccentColor } from "@/lib/content-types";

type Technique = "scrim" | "block" | "outline";
type ScrimDirection = "from-bottom" | "from-top" | "from-left" | "from-right";

interface OverlapTextProps {
  /**
   * The only three sanctioned ways to place type on top of an image or
   * color block, so overlap never happens freehand:
   *  - scrim: gradient wash behind the text, sized to the text box
   *  - block: a solid accent-color panel behind the text
   *  - outline: heavy variable-weight type + a hard canvas-color halo,
   *    for the rare case where the text must sit directly on open image
   */
  technique: Technique;
  accent?: AccentColor;
  direction?: ScrimDirection;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

const SCRIM_GRADIENT: Record<ScrimDirection, string> = {
  "from-bottom": "bg-gradient-to-t",
  "from-top": "bg-gradient-to-b",
  "from-left": "bg-gradient-to-r",
  "from-right": "bg-gradient-to-l",
};

const ACCENT_BG: Record<AccentColor, string> = {
  flame: "bg-flame",
  cobalt: "bg-cobalt",
  acid: "bg-acid",
};

const ACCENT_FG: Record<AccentColor, string> = {
  flame: "text-ink",
  cobalt: "text-ink",
  acid: "text-canvas",
};

/**
 * The single reusable primitive for "type on top of an image or color
 * block." No page should place raw type directly on unprocessed image
 * pixels — always route through one of these three techniques so contrast
 * stays checkable in one place rather than freehand per page.
 */
export function OverlapText({
  technique,
  accent = "flame",
  direction = "from-bottom",
  as: Tag = "span",
  className = "",
  children,
}: OverlapTextProps) {
  if (technique === "scrim") {
    return (
      <span className="relative isolate inline-block">
        <span
          aria-hidden
          className={`absolute -inset-x-4 -inset-y-3 -z-10 ${SCRIM_GRADIENT[direction]} from-canvas/95 via-canvas/70 to-transparent`}
        />
        <Tag className={`relative z-type text-ink ${className}`}>{children}</Tag>
      </span>
    );
  }

  if (technique === "block") {
    return (
      <Tag
        className={`relative z-type inline-block px-2 py-1 ${ACCENT_BG[accent]} ${ACCENT_FG[accent]} ${className}`}
      >
        {children}
      </Tag>
    );
  }

  // outline: heavy weight + a hard canvas-color halo via layered text-shadow,
  // for text that must sit directly on open image without a scrim/block.
  return (
    <Tag
      className={`relative z-type font-display font-bold text-ink [text-shadow:0_0_2px_rgb(var(--color-canvas)),0_0_10px_rgb(var(--color-canvas)),0_0_20px_rgb(var(--color-canvas))] ${className}`}
    >
      {children}
    </Tag>
  );
}
