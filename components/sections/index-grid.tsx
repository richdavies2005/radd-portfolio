import Image from "next/image";
import Link from "next/link";
import { TiltWrapper } from "@/components/motion/tilt-wrapper";
import { ParallaxImage } from "@/components/motion/parallax";
import type { AccentColor, Work } from "@/lib/content-types";

interface IndexGridProps {
  items: Work[];
  variant: "design" | "photography";
}

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

// Cycled per card to break the grid into large/small rhythm rather than a
// uniform tile wall — asymmetric, but on a disciplined repeating pattern.
const SPAN_PATTERN = ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-8"];
const HEIGHT_PATTERN = ["min-h-[420px]", "min-h-[320px]", "min-h-[320px]", "min-h-[420px]"];

export function IndexGrid({ items, variant }: IndexGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 px-3 py-8 md:grid-cols-12 md:px-6 md:py-12">
      {items.map((item, i) => {
        const href =
          item.medium === "photography" ? `/photography/${item.slug}` : `/work/${item.slug}`;
        const span = SPAN_PATTERN[i % SPAN_PATTERN.length];
        const height = HEIGHT_PATTERN[i % HEIGHT_PATTERN.length];

        return (
          <TiltWrapper key={item.slug} className={`col-span-1 ${span} ${height}`}>
            <Link
              href={href}
              data-cursor-view="View"
              className="grid-item-in group relative block h-full overflow-hidden"
              style={{ "--i": Math.min(i, 8) } as React.CSSProperties}
            >
              {item.cover && (
                <ParallaxImage fill amount={0.06}>
                  <Image
                    src={item.cover}
                    alt=""
                    fill
                    priority={i === 0}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(min-width: 768px) 66vw, 100vw"
                  />
                </ParallaxImage>
              )}
              <span
                className={`absolute left-0 top-0 z-type px-2 py-1 font-label text-xs uppercase tracking-wider ${ACCENT_BG[item.accentColor]} ${ACCENT_FG[item.accentColor]}`}
              >
                {item.year}
              </span>
              <div className="absolute inset-x-0 bottom-0 z-type bg-gradient-to-t from-canvas/95 via-canvas/60 to-transparent p-3">
                <h2 className="font-display text-3xl font-bold leading-tight text-ink">
                  {item.title}
                </h2>
                {variant === "design" && (
                  <p className="mt-1 max-w-md font-body text-sm text-ink-muted">
                    {item.summary}
                  </p>
                )}
                <ul className="mt-1 flex flex-wrap gap-2 font-label text-xs uppercase tracking-wider text-ink-muted">
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </Link>
          </TiltWrapper>
        );
      })}
    </div>
  );
}
