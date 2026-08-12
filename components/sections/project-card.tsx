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
      className="group -m-4 grid grid-cols-1 gap-6 rounded-none p-4 outline-none transition-colors duration-[350ms] ease-[cubic-bezier(0.3,0,0,1)] hover:bg-[#da9a9c] focus-visible:bg-[#da9a9c] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background md:-m-8 md:p-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center lg:gap-12"
    >
      <div className="order-last lg:order-first">
        <h3 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground md:text-3xl">
          {project.title}
        </h3>
        <p className="meta-text mt-3">{formatMeta([project.category, project.year])}</p>
        <span className="link-underline mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
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
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority={priority}
        />
      </AspectRatio>
    </Link>
  );
}
