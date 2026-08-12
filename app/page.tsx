import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/sections/hero";
import { ProjectGrid } from "@/components/sections/project-grid";
import { ClientMarquee } from "@/components/sections/client-marquee";
import { getPublishedProjects } from "@/lib/data/projects";
import { getClients } from "@/lib/data/clients";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default async function HomePage() {
  const [projects, { clients }] = await Promise.all([getPublishedProjects(), getClients()]);

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <section id="projetos" className="container-editorial pb-24 pt-8 md:pb-40">
          <h2 className="sr-only">Projetos</h2>
          <ProjectGrid projects={projects} />
        </section>
        <ClientMarquee clients={clients} />
      </main>
      <SiteFooter />
    </>
  );
}
