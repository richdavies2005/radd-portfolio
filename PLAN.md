# RADD Portfolio — Fresh Build Plan

## Context

Richard Davies (brand: **RADD**) needs a portfolio site showcasing graphic
design and photography work, used primarily to show **clients** (job
applications are a secondary use, not the primary framing). A prior AI-built
attempt already exists at `PortfolioWebsite/` — a working Next.js site
(~75% complete, 6 real pages, real animation work, 96/100 Lighthouse) — but
after reviewing it, Richard decided its visual/creative direction doesn't hit
the mark: he wants something bolder and genuinely distinctive ("stops a
viewer in their tracks"), not a polished-but-safe dark-theme site.

This plan is a **from-scratch rebuild** in a new sibling folder. The old
project is left completely untouched — nothing is deleted, nothing is
imported from it as a dependency. The only thing carried forward is a
**pattern**, not code or design: the old project's content-loading approach
(`project.json`/`series.json` + an images folder per item, read at build
time, zero markup changes needed to add content) worked well and is
visual-design-agnostic, so it's worth reimplementing fresh rather than
reinventing.

**Everything else — palette, type, layout system, motion — is a new
creative direction**, driven by Richard's brief: bold saturated color,
designer-esque display type, heavy but purposeful animation, overlapping/
asymmetric layouts, massive headlines. A "maximalist meets art-directed
magazine" mix, high craft rather than chaotic.

---

## Confirmed decisions (from Richard directly)

- **Purpose:** client-facing primary; also usable for job applications, but
  no CV/resume download needed.
- **Identity:** brand stays **RADD**; full name Richard Davies.
- **Bio:** studied at **AUT** (Auckland University of Technology) —
  Bachelor's in Design, majoring in **Communication Design**, minoring in
  **Photography and Creative Entrepreneurship**.
- **Contact page:** no form, no backend. Just name, email
  (`radd.designstudio@gmail.com`), phone (`+64 21 081 4537`), and a
  one-line blurb about what to contact him for. Calm, restrained layout —
  the one page where legibility wins over maximalism.
- **Fonts:** no licensed brand fonts available (ySANS/Acumin Pro never
  sourced) — pick free, self-hosted fonts as the **final** choice, suited
  to the new bold direction (not the old Space Grotesk/Work Sans stand-ins).
- **Aesthetic:** bold color, kinetic type, heavy animation, overlapping/
  asymmetric layout, oversized headlines — "maximalist + art-directed
  magazine," polished not chaotic.
- **Content:** real projects/photos not organized yet — build against
  realistic placeholder content (3 design projects, 3 photography series,
  matching the old project's scale) so real content drops in later without
  touching code.
- **Headshot:** keep a placeholder for now, but avoid the old "camera icon
  in a gradient box" — it read as an unfinished layout test, not a design
  choice.
- **Location:** new folder, sibling to `PortfolioWebsite/`, old folder left
  alone.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) + TypeScript + Tailwind | Proven for this old project too — the ambition here is visual/motion, not architectural, no reason to change |
| Animation | **GSAP + ScrollTrigger + SplitText**, via `@gsap/react`'s `useGSAP()` hook | The brief specifically wants kinetic split-text headlines and scroll-driven layered/overlapping reveals — GSAP's purpose-built plugins do this with far less hand-rolling than Framer Motion, which the old project was already stretching for these effects. Framer Motion is dropped entirely — simple hover/focus states use plain CSS transitions instead, so there's one animation system, not two |
| Smooth scroll (Lenis) | **Not included at first** — added only in the polish phase, and only if a real before/after Lighthouse + input-latency test justifies it | ScrollTrigger works correctly against native scroll. Lenis intercepts scroll and can fight with pinning, iOS momentum scroll, and keyboard/reduced-motion behavior — real accessibility risk for a site built around pinned/overlapping scroll sections. Decide with evidence, not by default |
| Fonts | `next/font/google` + `next/font/local`, self-hosted | Zero layout shift, no external requests |
| Icons | `lucide-react` | Real SVG icons, not emoji |
| Hosting | Vercel (static/SSG) | Natural fit, unchanged from before |

---

## Design system

**Palette** — keep the near-black RADD canvas (it's genuinely good), but
move from "dark theme + one red accent line" to a **small, confident set of
saturated color blocks**, which is what actually reads as "maximalist" and
"bold color":

| Token | Hex | Role |
|---|---|---|
| `--canvas` | `#121212` | Base ground |
| `--canvas-raised` | `#1A1A1A` | Card/panel surfaces |
| `--ink` | `#F5F2EA` | Primary text (warm off-white) |
| `--ink-muted` | `#A8A49C` | Secondary text |
| `--flame` | `#E31B23` | Kept RADD red — the one recurring brand thread (nav, links, cursor) |
| `--cobalt` | `#2C4BFF` | Second block color — themes the Work section |
| `--acid` | `#D9FF3F` | Third block color, used sparingly — themes the Photography section |

Rule: **one large color block per section, max**, plus flame-red as the
persistent thread everywhere. This is what keeps "bold" from tipping into
"every element fighting for attention."

**Type — final choice, not a placeholder:**
- **Display: Bricolage Grotesque** (Google Fonts, variable, free/OFL) — a
  genuinely distinctive grotesque built for expressive display use. Being
  variable means its weight can be *animated* (thin → bold as the hero
  headline settles in) — a real point of differentiation.
- **Body: General Sans** (Fontshare, self-hosted via `next/font/local`) —
  clean workhorse that doesn't compete with the display face. (Inter is the
  fallback if a single-source Google Fonts setup is preferred over
  self-hosting a second family.)
- **Labels/metadata: JetBrains Mono** (Google Fonts) — for captions, tags,
  year/medium labels — cheap way to add editorial-magazine polish.

Type scale extends past the old project's cap — `clamp()`-based sizing up
to ~10rem for the home hero, since "massive headlines" was explicit.

**Layout — the concrete mechanism for "overlapping/asymmetric," not
freehand chaos:**
- 12-column CSS Grid, with **named `grid-template-areas` per section**
  designed to deliberately misalign — e.g. a headline spans columns 1–9
  while an image sits in columns 8–12, overlapping by design in columns
  8–9. Built once as a shared `<Section>` primitive that takes a grid
  template per instance, so every page composes on the same disciplined
  8px-spacing/12-column foundation underneath.
- **z-index scale — exactly six named values**, no arbitrary numbers:
  `z-content` (0) → `z-overlap` (10) → `z-type` (20) → `z-sticky` (30) →
  `z-nav` (40) → `z-cursor` (50) → `z-modal` (100).
- **`<OverlapText>` primitive** — the single reusable component for "type
  on top of an image or color block." Every overlap must use one of three
  contrast-safe techniques: a gradient scrim behind the text, a solid
  color-block panel, or heavy variable-weight type + outline. No page is
  allowed to freehand type directly onto raw image pixels — this is what
  keeps the bold layout from becoming an accessibility failure.

---

## Content model

Same five sections as the old plan — the site structure wasn't the
problem, the visual system was:

```
/                        Home — kinetic hero, curated cross-medium highlights
/work/                   Graphic design index
/work/<slug>/            Graphic design case study
/photography/            Photography index
/photography/<slug>/     Photography series/gallery
/about/                  Bio — AUT / Communication Design / Photography+Creative Entrepreneurship
/contact/                Name, email, phone, blurb — no form
```

Content loader: reimplement the pattern from
[`PortfolioWebsite/lib/content.ts`](../../Docs/CLAUDE/PortfolioWebsite/lib/content.ts)
— filesystem scan of `content/{work,photography}/<slug>/{project.json|series.json}`
at build time, fail-fast with a clear error if a folder is missing its JSON
(that behavior is good, keep it exactly). Extend the schema
(from [`content-types.ts`](../../Docs/CLAUDE/PortfolioWebsite/lib/content-types.ts))
with three new fields the broken-grid layout needs:

```json
{
  "title": "", "slug": "", "year": "",
  "category": "graphic-design | photography",
  "tags": [], "summary": "", "role": "", "tools": [],
  "featured": false, "order": 1,
  "cover": "cover.jpg",
  "accentColor": "flame | cobalt | acid",
  "images": [
    {
      "src": "01.jpg", "alt": "", "caption": "",
      "ratio": "wide | standard | tall | square",
      "weight": "hero | large | medium | small",
      "overlap": "none | text | image"
    }
  ]
}
```

- `accentColor` — which block color themes that project/series (drives
  color from data, not hand-styled pages).
- `weight` — which images are "big and overlap-worthy" vs. supporting, so
  the broken-grid layout is data-driven rather than hardcoded per project.
- `overlap` — marks which images are safe/intended for the text-overlap
  treatment.

Placeholder content: **3 design projects + 3 photography series**, matching
the old project's realistic-not-lorem-ipsum placeholder style, ready to be
swapped for real content later with zero code changes.

---

## Page-by-page plan

- **Home** — full-viewport hero: GSAP SplitText headline (staggered
  char/word entrance, variable-weight tween thin→bold), asymmetric
  featured-image overlap via `<OverlapText>`. Curated cross-medium
  highlights (`featured: true`) in the broken-grid system — deliberately
  mismatched spans, not a uniform 3-up grid. Short positioning statement;
  full bio stays on About.
- **Work index/case study** — index cards themed by `accentColor`, varied
  grid spans. Case study: color-block header, image sequence driven by
  `weight`/`overlap` (alternating full-bleed/overlapping/contained for
  editorial rhythm), ScrollTrigger reveals, prev/next nav.
- **Photography index/gallery** — image-forward cards (acid-accent
  default). Gallery: weight-driven asymmetric grid, GSAP shared-element-
  style lightbox (scale+fade from the clicked thumbnail), keyboard +
  touch support.
- **About** — bio told as a short editorial narrative (AUT, Communication
  Design, Photography + Creative Entrepreneurship), not a bulleted resume.
  **Headshot placeholder:** an oversized "RD" monogram set in the display
  font at heavy weight, rendered as a solid color block occupying the
  photo's eventual grid slot — reads as an intentional brand asset, not a
  missing-image apology. Swapping in a real headshot later is a one-field
  data change.
- **Contact** — no form. Name, `mailto:` email, `tel:` phone, one-line
  blurb (draft: *"Available for freelance design and photography work —
  reach out about client projects, collaborations, or opportunities."*,
  confirm wording before shipping). Calmest page on the site — large type,
  generous whitespace, optional small social-icon row.

---

## Animation inventory

1. **Kinetic hero headline** — SplitText + variable-weight tween. The
   single biggest "stop and look" moment — most craft goes here.
2. **Scroll-triggered overlap reveals** — image-then-type staggered
   entrance as broken-grid sections enter viewport.
3. **Color-block wipes** — clip-path reveal (not a plain fade) when a
   themed section enters.
4. **Custom cursor** — pointer-fine only, morphs to a "view" label over
   cards, magnetic pull via `quickTo`.
5. **3D tilt on cards** — pointer-fine only, GSAP `quickTo`.
6. **Case-study scroll choreography** — 1–2 pinned/scrubbed hero moments
   per case study, used deliberately, not on every image.
7. **Lightbox open/close** — shared-element scale+fade, keyboard + touch.
8. **Route transitions** — ink-bleed/wipe style between pages via
   `template.tsx`.
9. **Nav hover/active** — plain CSS transitions, no JS needed.
10. **Grain overlay** — static, GPU-cheap texture layer.

**`prefers-reduced-motion`:** a single shared hook gates every GSAP call at
creation — reduced-motion resolves straight to the animation's end state
(not deleted, not played anyway), and pinned ScrollTrigger sections unpin
to normal flow. This is the default code path, not a bolted-on branch, and
gets its own explicit QA pass (toggle the OS setting, click every route).

**Performance target:** Lighthouse 90+ as the floor, aiming back toward the
old project's 96/100 once heavier motion is in. GPU-only properties
(`transform`/`opacity` — never `width`/`height`/`top`/`left`), `next/image`
everywhere with explicit dimensions, route-level code-splitting so
ScrollTrigger/SplitText don't bloat the global bundle.

---

## Repo structure & build phases

**Location:** `/Users/richarddavies/Docs/CLAUDE/RADD/` (sibling to
`PortfolioWebsite/`; named after the actual brand rather than "-v2," since
this isn't a sequel to the old build).

```
RADD/
  app/                     layout, page, template (transitions), work/, photography/, about/, contact/
  components/
    ui/                    button, tag, section-label
    layout/                Section (broken-grid), OverlapText
    sections/              hero, highlights, nav, footer
    gallery/                lightbox, image grid
    motion/                 GSAP hooks: useSplitReveal, useScrollReveal, useTilt, useMagnetic, cursor
  content/
    work/<slug>/{project.json, cover.jpg, 01.jpg...}
    photography/<slug>/{series.json, cover.jpg, 01.jpg...}
  lib/
    content.ts              filesystem loader (ported pattern)
    content-types.ts
    motion.ts                usePrefersReducedMotion, shared eases
  public/fonts/              self-hosted General Sans .woff2 (if not using Google Fonts fallback)
  tailwind.config.ts         tokens: color, type scale, z-index scale
```

**Phases:**
1. Foundation — scaffold, GSAP install, design tokens wired into Tailwind
   + CSS variables, fonts loaded, base nav/footer shell.
2. Content model — port the loader pattern, populate 3+3 placeholder
   folders.
3. Layout primitives — `<Section>` and `<OverlapText>` built and tested
   before any page depends on them.
4. Home/Hero.
5. Work section (index + case study).
6. Photography section (index + gallery + lightbox).
7. About + Contact.
8. Motion polish — cursor, tilt, transitions, grain, color-block wipes;
   evaluate Lenis here with real numbers.
9. Accessibility + performance pass (see below) — Lighthouse 90+ on all
   six routes.
10. Deploy to Vercel; real content drops in later with no code changes.

---

## Accessibility guardrails (given the aggressive visual ambition)

- **Contrast on overlaps:** structurally enforced by `<OverlapText>` — every
  instance must use a scrim, solid block, or heavy-weight+outline. Checked
  against worst-case pixel regions in the phase-9 audit, not assumed.
- **Focus order:** DOM order always follows logical reading sequence
  (headline → content → image); CSS Grid placement handles the visual
  rearrangement, never DOM/`order` tricks that would make tab order jump.
  Verified with an actual keyboard-only pass through every page.
- **Reduced motion:** verified live (OS toggle, not just code review) —
  every route must still look composed and complete, just without motion.
- Standard baseline carried through: semantic HTML, real `alt` text from
  content JSON, visible focus rings everywhere, responsive `next/image`
  with explicit dimensions, no arbitrary z-index values outside the
  six-value scale.

---

## Verification

- `npm run dev` and click through all six routes at each build phase
  checkpoint, not just at the end.
- Toggle `prefers-reduced-motion` (OS-level) and re-click every route —
  confirm no broken/stuck layouts (especially pinned ScrollTrigger
  sections).
- Run Lighthouse (`npm run build && npx serve` or Vercel preview) on `/`,
  a case-study page, and the photography gallery — target 90+ performance,
  100 accessibility.
- Keyboard-only pass: Tab through nav, a broken-grid work index, and the
  lightbox (arrows/Esc) — confirm focus order matches reading order despite
  the asymmetric visual layout.
- Manual contrast check on every `<OverlapText>` instance against its
  underlying image/color.

---

## Open items to confirm with Richard before/soon after build starts

1. Exact contact blurb wording (draft suggested above).
2. Phone number display formatting (`+64 21 081 4537` vs. grouped
   differently) — confirm grouping once real content goes in; `tel:` href
   will use digits-only regardless of display formatting.
3. Whether to self-host General Sans or use Inter as a simpler
   single-source (Google Fonts only) alternative.
