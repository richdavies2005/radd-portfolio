import type { Metadata } from "next";
import { photographyWorks } from "@/lib/content";
import { PageHeader } from "@/components/sections/page-header";
import { IndexGrid } from "@/components/sections/index-grid";

export const metadata: Metadata = { title: "Photography" };

export default function PhotographyIndex() {
  return (
    <>
      <PageHeader eyebrow="Photography" title="Photography" />
      <IndexGrid items={photographyWorks} variant="photography" />
    </>
  );
}
