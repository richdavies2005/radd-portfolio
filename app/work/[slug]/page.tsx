import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWork, graphicDesignWorks } from "@/lib/content";
import { ImageCaseStudyHeader, PrevNextNav } from "@/components/sections/case-study";
import { FocusRail } from "@/components/gallery/focus-rail";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return graphicDesignWorks.map((work) => ({ slug: work.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const work = getWork(params.slug);
  return { title: work?.title ?? "Design" };
}

export default function WorkCaseStudy({ params }: Params) {
  const work = getWork(params.slug);
  if (!work || work.medium !== "graphic-design") notFound();

  return (
    <>
      <ImageCaseStudyHeader work={work} />
      <FocusRail
        images={work.images}
        enableLightbox
        introText={work.blurb}
        introLabel={work.blurbLabel ?? "The project"}
      />
      <PrevNextNav work={work} />
    </>
  );
}
