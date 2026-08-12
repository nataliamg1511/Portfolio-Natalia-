import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-children";
import { ProjectCard } from "@/components/sections/project-card";
import type { Project } from "@/lib/types";

/**
 * Grid de projetos da Home — DESIGN_SYSTEM.md seção 4.1: 3 colunas
 * desktop / 2 tablet / 1 mobile, gap-x-8 gap-y-16. Estado vazio amigável
 * conforme UX_ARCHITECTURE.md seção 6.
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="border border-dashed border-border px-6 py-24 text-center">
        <p className="font-display text-xl text-foreground">Novos projetos em breve.</p>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <StaggerItem key={project.id}>
          <ProjectCard project={project} priority={index < 3} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
