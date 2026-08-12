import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-children";
import { ProjectCard } from "@/components/sections/project-card";
import type { Project } from "@/lib/types";

/**
 * Grid de projetos da Home — cards horizontais grandes (referência
 * bitagoli.com): 2 colunas no desktop, 1 na coluna única mobile/tablet,
 * gap generoso (`gap-x-10 gap-y-20`, mais respiro vertical que horizontal).
 * Estado vazio amigável conforme UX_ARCHITECTURE.md seção 6.
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
    <StaggerContainer className="grid grid-cols-1 gap-x-10 gap-y-20 lg:grid-cols-2 lg:gap-y-24">
      {projects.map((project, index) => (
        <StaggerItem key={project.id}>
          <ProjectCard project={project} priority={index < 2} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
