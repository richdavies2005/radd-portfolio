import type { Metadata } from "next";
import Image from "next/image";
import { Section, Area } from "@/components/layout/section";

export const metadata: Metadata = { title: "About" };

// Each chip is evidenced by work published on the site: the first three by the
// design projects, the last four by the photography series. Keep it that way.
const DISCIPLINES = [
  "Brand identity",
  "Packaging",
  "Print & stationery",
  "Conceptual photography",
  "Fashion photography",
  "Portraiture",
  "Landscape photography",
];

const APPROACH = [
  {
    title: "Design",
    body: "Systems before decoration. I build identity work on a structure that holds up across every touchpoint it needs to survive, from a single pack to a full range.",
  },
  {
    title: "Photography",
    body: "A light hand in the edit. The composition and the moment do the work, and retouching stays in service of what was actually there.",
  },
  {
    title: "Process",
    body: "Constraints first. Budget, medium and audience shape the brief before I propose any visual direction, so the work feels inevitable rather than decorative.",
  },
];

const BIO_AREAS = `
  "bio bio bio bio bio bio bio . portrait portrait portrait portrait"
  "bio bio bio bio bio bio bio . portrait portrait portrait portrait"
`;

export default function About() {
  return (
    <>
      <header className="px-3 pb-4 pt-20 md:px-6 md:pt-24">
        <p className="font-label text-xs uppercase tracking-wider text-flame-text">About</p>
        <h1 className="mt-2 break-words font-display text-4xl font-bold leading-[0.95] tracking-tight text-ink sm:text-5xl md:text-8xl">
          Richard Davies
        </h1>
      </header>

      <Section areasMd={BIO_AREAS} className="gap-6 px-3 pb-16 pt-4 md:px-6 md:pb-24">
        <Area name="bio" className="flex flex-col gap-4">
          <p className="font-body text-lg text-ink-muted">
            I studied communication design at Auckland University of Technology
            (AUT), with minors in photography and creative entrepreneurship.
            That combination shows up directly in how I work. Identity and
            packaging get the same attention to light, composition and
            restraint that I put into a photograph, and I treat client work as
            an ongoing practice rather than a run of one-off jobs.
          </p>
          <p className="font-body text-lg text-ink-muted">
            I&rsquo;m based in Auckland and work with clients directly on
            identity systems, packaging, print and photography. Design and
            image-making are one practice for me, not two separate
            disciplines.
          </p>
          <ul className="mt-2 flex flex-wrap gap-2 font-label text-xs uppercase tracking-wider text-ink-muted">
            {DISCIPLINES.map((d) => (
              <li key={d} className="rounded-sm border border-ink-muted/30 px-2 py-1">
                {d}
              </li>
            ))}
          </ul>
        </Area>
        <Area name="portrait">
          {/* Aspect matches the source frame (2:3), so the portrait is never
              cropped through the face. From md up it's sized by height rather
              than by column width — at wide viewports a full-width 2:3 box is
              taller than the screen and runs off the bottom of the fold, so the
              height is capped and the width derives from the ratio. */}
          <div className="relative aspect-[2/3] w-full overflow-hidden md:ml-auto md:h-[min(50vh,28rem)] md:w-auto">
            <Image
              src="/about/portrait.jpg"
              alt="Richard Davies"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 25vw, 100vw"
            />
          </div>
        </Area>
      </Section>

      <section className="grid grid-cols-1 gap-8 border-t border-ink-muted/20 px-3 py-16 md:grid-cols-3 md:px-6 md:py-24">
        {APPROACH.map((item) => (
          <div key={item.title}>
            <h2 className="font-display text-2xl font-bold text-ink">{item.title}</h2>
            <p className="mt-2 font-body text-base text-ink-muted">{item.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
