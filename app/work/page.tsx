import type { Metadata } from "next";
import { graphicDesignWorks } from "@/lib/content";
import { PageHeader } from "@/components/sections/page-header";
import { IndexGrid } from "@/components/sections/index-grid";

export const metadata: Metadata = { title: "Design" };

export default function WorkIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Design"
        title="Design"
        intro="Identity systems, packaging, and environmental design — case studies from client projects."
      />
      <IndexGrid items={graphicDesignWorks} variant="design" />
    </>
  );
}
