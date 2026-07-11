import type { Metadata } from "next";
import { Section, Area } from "@/components/layout/section";
import { Monogram } from "@/components/sections/monogram";

export const metadata: Metadata = { title: "About" };

const DISCIPLINES = [
  "Brand identity",
  "Editorial & print",
  "Packaging",
  "Art direction",
  "Landscape photography",
  "Portraiture",
  "Wayfinding & signage",
];

const APPROACH = [
  {
    title: "Design",
    body: "Systems before decoration — identity work built on a structure that holds up across every touchpoint it needs to survive, from a business card to a signage program.",
  },
  {
    title: "Photography",
    body: "A light hand in the edit. The composition and the moment do the work; retouching stays in service of what was actually there.",
  },
  {
    title: "Process",
    body: "Constraints first. Budget, medium, and audience shape the brief before any visual direction gets proposed — the work should feel inevitable, not decorative.",
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
            Richard trained in communication design at Auckland University of
            Technology (AUT), with minors in photography and creative
            entrepreneurship — a combination that shows up directly in how he
            works. Identity and packaging get the same attention to light,
            composition, and restraint that goes into a photograph, and
            client work is treated as an ongoing practice rather than a
            series of one-off jobs.
          </p>
          <p className="font-body text-lg text-ink-muted">
            Based in Auckland, working with clients directly on identity
            systems, packaging, editorial design, and photography — design
            and image-making treated as one practice rather than two
            separate disciplines.
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
          <Monogram />
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
