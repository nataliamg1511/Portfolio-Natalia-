import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-children";
import { ProjectCard } from "@/components/sections/project-card";
import type { Project } from "@/lib/types";

/**
 * Lista de projetos da Home — um card por linha (referência bitagoli.com):
 * texto à esquerda + imagem grande à direita, com muito respiro vertical
 * entre projetos. Estado vazio amigável conforme UX_ARCHITECTURE.md seção 6.
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
    <StaggerContainer className="grid grid-cols-1 gap-y-20 md:gap-y-28">
      {projects.map((project, index) => (
        <StaggerItem key={project.id}>
          <ProjectCard project={project} priority={index < 2} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
