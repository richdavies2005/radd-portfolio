import Image from "next/image";
import Link from "next/link";
import { ColorBlockReveal } from "@/components/motion/color-block-reveal";
import { adjacentWorks } from "@/lib/content";
import type { AccentColor, Work } from "@/lib/content-types";

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

function CaseStudyMeta({ work }: { work: Work }) {
  return (
    <>
      <p className="font-label text-xs uppercase tracking-wider">
        {work.year} — {work.medium === "photography" ? "Photography" : "Design"}
      </p>
      <h1 className="mt-2 max-w-3xl break-words font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl md:text-8xl">
        {work.title}
      </h1>
      <p className="mt-4 max-w-xl font-body text-lg">{work.summary}</p>
      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-label text-xs uppercase tracking-wider">
        {work.role && (
          <div>
            <dt className="font-semibold">Role</dt>
            <dd>{work.role}</dd>
          </div>
        )}
        {work.tools && work.tools.length > 0 && (
          <div>
            <dt className="font-semibold">Tools</dt>
            <dd>{work.tools.join(", ")}</dd>
          </div>
        )}
        {work.tags.length > 0 && (
          <div>
            <dt className="font-semibold">Tags</dt>
            <dd>{work.tags.join(", ")}</dd>
          </div>
        )}
      </dl>
    </>
  );
}

export function CaseStudyHeader({ work }: { work: Work }) {
  return (
    <ColorBlockReveal
      className={`px-3 pb-8 pt-20 md:px-6 md:pt-24 ${ACCENT_BG[work.accentColor]} ${ACCENT_FG[work.accentColor]}`}
    >
      <CaseStudyMeta work={work} />
    </ColorBlockReveal>
  );
}

/**
 * Image variant of the case-study header: a full-bleed photo behind the same
 * title/meta, with scrims top and bottom — the top one keeps the fixed nav
 * readable over bright frames, the bottom one anchors the title. The image is
 * only borrowed for the header — it still appears in the rail.
 *
 * An explicit `headerImage` in the JSON wins outright. Otherwise the source
 * preference differs by medium: photography leads with a landscape frame from
 * the series (its covers are often portrait crops), design leads with the
 * project cover. Each falls back to the other, then to the color-block header.
 */
export function ImageCaseStudyHeader({ work }: { work: Work }) {
  const landscape =
    work.images.find((img) => img.src && img.ratio === "wide") ??
    work.images.find((img) => img.src && img.ratio === "standard");
  const src =
    work.headerImage ??
    (work.medium === "photography"
      ? landscape?.src ?? work.cover
      : work.cover ?? landscape?.src);

  if (!src) return <CaseStudyHeader work={work} />;

  return (
    <ColorBlockReveal className="relative flex min-h-[70svh] flex-col justify-end overflow-hidden px-3 pb-8 pt-20 text-ink md:px-6 md:pt-24">
      <Image
        src={src}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* Top scrim: keeps the fixed nav legible over a bright frame. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-canvas via-canvas/70 to-transparent"
      />
      {/* Bottom scrim: anchors the title/summary over the image. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-canvas/40 to-canvas/10"
      />
      <div className="relative">
        <CaseStudyMeta work={work} />
      </div>
    </ColorBlockReveal>
  );
}

export function PrevNextNav({ work }: { work: Work }) {
  const { prev, next } = adjacentWorks(work);
  const base = work.medium === "photography" ? "/photography" : "/work";

  return (
    <nav className="grid grid-cols-1 gap-6 border-t border-ink-muted/20 px-3 py-8 md:grid-cols-2 md:px-6 md:py-12">
      <Link href={`${base}/${prev.slug}`} className="group">
        <p className="font-label text-xs uppercase tracking-wider text-ink-muted">Previous</p>
        <p className="mt-1 font-display text-2xl font-bold text-ink transition-colors group-hover:text-flame-text">
          {prev.title}
        </p>
      </Link>
      <Link href={`${base}/${next.slug}`} className="group text-right">
        <p className="font-label text-xs uppercase tracking-wider text-ink-muted">Next</p>
        <p className="mt-1 font-display text-2xl font-bold text-ink transition-colors group-hover:text-flame-text">
          {next.title}
        </p>
      </Link>
    </nav>
  );
}
