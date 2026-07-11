import "server-only";
import fs from "node:fs";
import path from "node:path";
import type {
  AccentColor,
  ImageWeight,
  Medium,
  OverlapHint,
  Ratio,
  Work,
  WorkImage,
} from "./content-types";

export * from "./content-types";

/**
 * Loads projects/series from public/content/{work,photography}/<slug>/
 * at build time — one folder per project, containing project.json (or
 * series.json for photography) plus its images. Drop a new folder in,
 * no code changes needed.
 */
const CONTENT_ROOT = path.join(process.cwd(), "public", "content");

const MEDIUM_FOLDERS: Record<Medium, { dir: string; jsonFile: string }> = {
  "graphic-design": { dir: "work", jsonFile: "project.json" },
  photography: { dir: "photography", jsonFile: "series.json" },
};

const RATIOS: Ratio[] = ["wide", "standard", "tall", "square"];
const ACCENTS: AccentColor[] = ["flame", "cobalt", "acid"];
const WEIGHTS: ImageWeight[] = ["hero", "large", "medium", "small"];
const OVERLAPS: OverlapHint[] = ["none", "text", "image"];

function readEntries(medium: Medium): Work[] {
  const { dir, jsonFile } = MEDIUM_FOLDERS[medium];
  const mediumDir = path.join(CONTENT_ROOT, dir);
  if (!fs.existsSync(mediumDir)) return [];

  return fs
    .readdirSync(mediumDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry): Work => {
      const slug = entry.name;
      const jsonPath = path.join(mediumDir, slug, jsonFile);
      if (!fs.existsSync(jsonPath)) {
        throw new Error(
          `Missing ${jsonFile} in public/content/${dir}/${slug}/ — every project folder needs one.`,
        );
      }

      let raw: Record<string, unknown>;
      try {
        raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      } catch (err) {
        throw new Error(
          `Invalid JSON in public/content/${dir}/${slug}/${jsonFile}: ${(err as Error).message}`,
        );
      }

      for (const field of ["title", "year", "summary"] as const) {
        if (!raw[field]) {
          throw new Error(
            `public/content/${dir}/${slug}/${jsonFile} is missing required field "${field}"`,
          );
        }
      }

      const publicBase = `/content/${dir}/${slug}`;
      const rawImages = Array.isArray(raw.images) ? raw.images : [];
      const images: WorkImage[] = rawImages.map((img) => {
        const i = img as Record<string, unknown>;
        return {
          src: i.src ? `${publicBase}/${i.src as string}` : undefined,
          alt: typeof i.alt === "string" ? i.alt : String(raw.title),
          caption: typeof i.caption === "string" ? i.caption : undefined,
          ratio: RATIOS.includes(i.ratio as Ratio)
            ? (i.ratio as Ratio)
            : "standard",
          weight: WEIGHTS.includes(i.weight as ImageWeight)
            ? (i.weight as ImageWeight)
            : "medium",
          overlap: OVERLAPS.includes(i.overlap as OverlapHint)
            ? (i.overlap as OverlapHint)
            : "none",
        };
      });

      return {
        slug,
        title: String(raw.title),
        medium,
        year: String(raw.year),
        summary: String(raw.summary),
        tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
        featured: Boolean(raw.featured),
        accentColor: ACCENTS.includes(raw.accentColor as AccentColor)
          ? (raw.accentColor as AccentColor)
          : "flame",
        cover: raw.cover ? `${publicBase}/${raw.cover as string}` : undefined,
        headerImage: raw.headerImage
          ? `${publicBase}/${raw.headerImage as string}`
          : undefined,
        coverRatio: RATIOS.includes(raw.coverRatio as Ratio)
          ? (raw.coverRatio as Ratio)
          : "wide",
        role: typeof raw.role === "string" ? raw.role : undefined,
        tools: Array.isArray(raw.tools) ? (raw.tools as string[]) : undefined,
        images,
        order: typeof raw.order === "number" ? raw.order : undefined,
        blurb: typeof raw.blurb === "string" ? raw.blurb : undefined,
        blurbLabel:
          typeof raw.blurbLabel === "string" ? raw.blurbLabel : undefined,
      };
    });
}

function sortWorks(list: Work[]): Work[] {
  return [...list].sort((a, b) => {
    if (a.order !== undefined || b.order !== undefined) {
      return (a.order ?? Infinity) - (b.order ?? Infinity);
    }
    return Number(b.year) - Number(a.year);
  });
}

export const works: Work[] = sortWorks([
  ...readEntries("graphic-design"),
  ...readEntries("photography"),
]);

export const featuredWorks = works.filter((w) => w.featured);

export const graphicDesignWorks = works.filter(
  (w) => w.medium === "graphic-design",
);
export const photographyWorks = works.filter((w) => w.medium === "photography");

export function worksByMedium(medium: Medium): Work[] {
  return works.filter((w) => w.medium === medium);
}

export function getWork(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}

/** Previous/next within the same medium, wrapping around the ends. */
export function adjacentWorks(work: Work): { prev: Work; next: Work } {
  const list = worksByMedium(work.medium);
  const i = list.findIndex((w) => w.slug === work.slug);
  const prev = list[(i - 1 + list.length) % list.length];
  const next = list[(i + 1) % list.length];
  return { prev, next };
}
