import { graphicDesignWorks, photographyWorks } from "@/lib/content";
import { Hero } from "@/components/sections/hero";
import { ProjectCarousel } from "@/components/sections/project-carousel";

export default function Home() {
  return (
    <>
      <Hero />
      <ProjectCarousel design={graphicDesignWorks} photography={photographyWorks} />
    </>
  );
}
