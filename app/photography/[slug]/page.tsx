import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWork, photographyWorks } from "@/lib/content";
import { ImageCaseStudyHeader, PrevNextNav } from "@/components/sections/case-study";
import { FocusRail } from "@/components/gallery/focus-rail";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return photographyWorks.map((work) => ({ slug: work.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const work = getWork(params.slug);
  return { title: work?.title ?? "Photography" };
}

export default function PhotographySeries({ params }: Params) {
  const work = getWork(params.slug);
  if (!work || work.medium !== "photography") notFound();

  return (
    <>
      <ImageCaseStudyHeader work={work} />
      <FocusRail
        images={work.images}
        enableLightbox
        introText={work.blurb}
        introLabel={work.blurbLabel ?? "The shoot"}
      />
      <PrevNextNav work={work} />
    </>
  );
}
