"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import MarqueeAlongSvgPath from "@/components/ui/marquee-along-svg-path";
import type { Client } from "@/lib/types";

// Serpentina longa (3 faixas onduladas) — o comprimento do caminho é o que
// define o respiro entre as logos: 22 tiles de ~128px precisam de ~5000px
// de trilha para não se sobreporem.
const PATH =
  "M20 90 C 500 190, 1100 -10, 1580 90 C 1650 120, 1650 220, 1580 250 C 1100 350, 500 150, 20 250 C -50 280, -50 380, 20 410 C 500 510, 1100 310, 1580 410";

const VIEW_BOX = "0 0 1600 500";

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
      <div className="mx-auto mt-10 h-[280px] w-full max-w-[1440px] px-6 md:h-[460px] md:px-10">
        <MarqueeAlongSvgPath
          path={PATH}
          viewBox={VIEW_BOX}
          baseVelocity={2}
          slowdownOnHover
          repeat={1}
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
