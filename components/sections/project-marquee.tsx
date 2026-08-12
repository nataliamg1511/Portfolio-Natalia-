"use client";

import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import MarqueeAlongSvgPath from "@/components/ui/marquee-along-svg-path";
import type { Project } from "@/lib/types";

// Curva suave inspirada na demo do componente — puramente decorativa, sem
// significado semântico; só dá "trilha" para as capas fluírem.
const PATH =
  "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5";

interface ProjectMarqueeProps {
  projects: Project[];
}

/**
 * Fecho visual da Home: as capas dos projetos publicados fluindo ao longo
 * de um path SVG (componente `MarqueeAlongSvgPath`, ver components/ui).
 * Cada capa linka para o case correspondente — é navegação real, com o
 * mesmo destino dos cards do grid acima, só que em formato editorial de
 * "fita" contínua. Respeita `prefers-reduced-motion`: nesse caso, vira uma
 * fileira estática (sem animação, sem offset-path).
 */
export function ProjectMarquee({ projects }: ProjectMarqueeProps) {
  const shouldReduceMotion = useReducedMotion();

  if (projects.length === 0) return null;

  if (shouldReduceMotion) {
    return (
      <section className="border-t border-border py-24 md:py-32" aria-label="Mais projetos">
        <div className="container-editorial">
          <ul className="flex flex-wrap items-center justify-center gap-6">
            {projects.map((project) => (
              <li key={project.id} className="w-28 shrink-0 md:w-36">
                <Link
                  href={`/projetos/${project.slug}`}
                  className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  <span className="relative block aspect-[4/3] w-full overflow-hidden bg-secondary">
                    <Image
                      src={project.cover_image_url}
                      alt={project.cover_image_alt}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden border-t border-border py-24 md:py-32" aria-label="Mais projetos">
      <div className="mx-auto h-[240px] w-full max-w-[1440px] px-6 md:h-[320px] md:px-10">
        <MarqueeAlongSvgPath
          path={PATH}
          viewBox="0 0 996 330"
          baseVelocity={5}
          slowdownOnHover
          repeat={2}
          responsive
          className="h-full w-full"
        >
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projetos/${project.slug}`}
              className="block w-24 outline-none transition-transform duration-180 ease-[cubic-bezier(0.3,0,0,1)] hover:scale-110 focus-visible:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background md:w-32"
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden bg-secondary">
                <Image
                  src={project.cover_image_url}
                  alt={project.cover_image_alt}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </span>
            </Link>
          ))}
        </MarqueeAlongSvgPath>
      </div>
    </section>
  );
}
