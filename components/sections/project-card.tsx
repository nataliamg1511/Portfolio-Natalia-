import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CrossfadeImage } from "@/components/motion/crossfade-image";
import { formatMeta } from "@/lib/format";
import type { Project } from "@/lib/types";

/**
 * Card de projeto — um por linha, como na referência (bitagoli.com):
 * bloco de texto à esquerda (título, categoria · ano, "Ver projeto →")
 * verticalmente centralizado, imagem 4:3 grande à direita. No mobile a
 * imagem vem primeiro e o texto abaixo. Card inteiro clicável (link real),
 * sem moldura/sombra, radius 0.
 */
export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="group grid grid-cols-1 gap-6 rounded-none outline-none transition-colors duration-[350ms] ease-[cubic-bezier(0.3,0,0,1)] hover:bg-[#da9a9c] focus-visible:bg-[#da9a9c] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center lg:gap-12"
    >
      <div className="order-last pb-4 lg:order-first lg:py-8 lg:pl-8">
        <h3 className="font-display text-3xl font-medium tracking-[-0.01em] text-foreground transition-colors duration-[350ms] group-hover:text-white group-focus-visible:text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          {project.title}
        </h3>
        <p className="meta-text mt-4 transition-colors duration-[350ms] group-hover:text-white/90 group-focus-visible:text-white/90">
          {formatMeta([project.category, project.year])}
        </p>
        <span className="link-underline mt-6 inline-flex items-center gap-1.5 text-base font-medium text-foreground transition-colors duration-[350ms] group-hover:text-white group-focus-visible:text-white">
          <span>Ver projeto</span>
          <span className="arrow-trailing" aria-hidden>
            →
          </span>
        </span>
      </div>
      <AspectRatio ratio={4 / 3}>
        <CrossfadeImage
          src={project.cover_image_url}
          hoverSrc={project.hover_image_url}
          alt={project.cover_image_alt}
          hoverAlt={project.hover_image_alt}
          position={project.cover_image_position}
          hoverPosition={project.hover_image_position}
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority={priority}
        />
      </AspectRatio>
    </Link>
  );
}
