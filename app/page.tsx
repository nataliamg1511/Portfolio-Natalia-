import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/sections/hero";
import { ProjectGrid } from "@/components/sections/project-grid";
import { getPublishedProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default async function HomePage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <section id="projetos" className="container-editorial pb-24 pt-8 md:pb-40">
          <h2 className="sr-only">Projetos</h2>
          <ProjectGrid projects={projects} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
