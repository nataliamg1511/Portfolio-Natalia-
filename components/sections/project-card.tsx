import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CrossfadeImage } from "@/components/motion/crossfade-image";
import { formatMeta } from "@/lib/format";
import type { Project } from "@/lib/types";

/**
 * Card de projeto do grid — DESIGN_SYSTEM.md seção 7.2. Card inteiro
 * clicável (link real, não div+onClick), sem moldura/sombra, radius 0.
 */
export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="group block rounded-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <AspectRatio ratio={4 / 3}>
        <CrossfadeImage
          src={project.cover_image_url}
          hoverSrc={project.hover_image_url}
          alt={project.cover_image_alt}
          hoverAlt={project.hover_image_alt}
          priority={priority}
        />
      </AspectRatio>
      <div className="mt-4">
        <h3 className="font-display text-xl font-medium text-foreground md:text-2xl">{project.title}</h3>
        <p className="meta-text mt-2">{formatMeta([project.category, project.year])}</p>
        <span className="link-underline mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
          <span>Ver projeto</span>
          <span className="arrow-trailing" aria-hidden>
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
