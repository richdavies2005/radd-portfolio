# Content authoring

Every project/series is a folder under `work/` (graphic design) or
`photography/`, containing a JSON file plus its images. **Drop a new folder
in, restart the dev server, and it appears — no code changes needed.**

```
content/
  work/<slug>/
    project.json
    cover.jpg  01.jpg  02.jpg …
  photography/<slug>/
    series.json
    cover.jpg  01.jpg  02.jpg …
```

The build **fails with a clear error** if a folder is missing its JSON or a
required field — this is intentional, so broken content never ships silently.

## Schema

```jsonc
{
  "title": "Editorial Identity System",   // required
  "year": "2025",                          // required
  "category": "graphic-design",            // or "photography"
  "summary": "One or two sentences.",      // required
  "tags": ["branding", "typography"],
  "role": "Art Direction & Design",        // work only, optional
  "tools": ["Illustrator", "InDesign"],    // work only, optional
  "featured": true,                         // shows on the home page
  "order": 1,                               // lower = earlier; else sorted by year desc
  "cover": "cover.jpg",
  "coverRatio": "wide",                    // wide | standard | tall | square
  "accentColor": "cobalt",                 // flame | cobalt | acid — themes this project
  "images": [
    {
      "src": "01.jpg",
      "alt": "Descriptive alt text — required for accessibility",
      "caption": "Optional caption.",
      "ratio": "tall",                     // wide | standard | tall | square
      "weight": "hero",                    // hero | large | medium | small — drives grid size
      "overlap": "text"                    // none | text | image (see below)
    }
  ]
}
```

### Field notes

- **`accentColor`** — which of the three brand block-colors themes this
  project's header and index card. Keep it deliberate: it's a bold color,
  used one-per-section.
- **`weight`** — how big the image is in the asymmetric gallery/case-study
  grid. Mark the standout shots `hero`/`large`, supporting shots
  `medium`/`small`.
- **`overlap`** — `text` means the image has a calm region safe to place a
  headline over; `image` pairs this image with the next one in an
  overlapping layered layout; `none` renders it in normal flow.

## Swapping placeholders for real work

The current images are locally-generated SVG placeholders (see
`scripts/generate-placeholders.mjs`). To go live with real photos:

1. Drop real `.jpg`/`.webp` files into each folder, matching the filenames
   referenced in the JSON (or update the JSON `src`/`cover` values).
2. Real raster photos don't need the `dangerouslyAllowSVG` image setting —
   once no SVGs remain in `content/`, that block in `next.config.mjs` can
   be removed.
