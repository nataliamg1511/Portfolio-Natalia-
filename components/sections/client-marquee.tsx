"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import MarqueeAlongSvgPath from "@/components/ui/marquee-along-svg-path";
import type { Client } from "@/lib/types";

// Curva suave inspirada na demo do componente — puramente decorativa, sem
// significado semântico; só dá "trilha" para as logos fluírem.
const PATH =
  "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5";

const LOGO_TILE_CLASS =
  "flex h-20 w-32 shrink-0 items-center justify-center rounded-[0.25rem] border border-border bg-background p-3 transition-transform duration-180 ease-[cubic-bezier(0.3,0,0,1)] hover:scale-110 md:h-24 md:w-40";

interface ClientMarqueeProps {
  clients: Client[];
}

function LogoTile({ client, sizes }: { client: Client; sizes: string }) {
  return (
    <div className={LOGO_TILE_CLASS}>
      <div className="relative h-full w-full">
        <Image src={client.logo_url} alt={client.logo_alt} fill sizes={sizes} className="object-contain" />
      </div>
    </div>
  );
}

/**
 * Vitrine de logos de clientes ("Pra quem já escrevi") — fecho visual da
 * Home, logo depois do grid de projetos. Mesmo componente de path SVG do
 * marquee de capas (`MarqueeAlongSvgPath`, ver components/ui), mas os
 * itens aqui não são clicáveis — são só a vitrine de marcas atendidas.
 * Logos têm fundos/proporções variados; o tile branco com padding e
 * hairline dá um tratamento neutro consistente independente da arte de
 * cada uma. Respeita `prefers-reduced-motion`: vira fileira estática.
 */
export function ClientMarquee({ clients }: ClientMarqueeProps) {
  const shouldReduceMotion = useReducedMotion();

  if (clients.length === 0) return null;

  const heading = (
    <h2 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground md:text-[2rem]">
      Pra quem já escrevi
    </h2>
  );

  if (shouldReduceMotion) {
    return (
      <section className="border-t border-border py-24 md:py-32">
        <div className="container-editorial">
          {heading}
          <ul className="mt-10 flex flex-wrap items-center gap-6">
            {clients.map((client) => (
              <li key={client.id}>
                <LogoTile client={client} sizes="160px" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden border-t border-border py-24 md:py-32">
      <div className="container-editorial">{heading}</div>
      <div className="mx-auto mt-10 h-[240px] w-full max-w-[1440px] px-6 md:h-[320px] md:px-10">
        <MarqueeAlongSvgPath
          path={PATH}
          viewBox="0 0 996 330"
          baseVelocity={5}
          slowdownOnHover
          repeat={2}
          responsive
          className="h-full w-full"
        >
          {clients.map((client) => (
            <LogoTile key={client.id} client={client} sizes="160px" />
          ))}
        </MarqueeAlongSvgPath>
      </div>
    </section>
  );
}
