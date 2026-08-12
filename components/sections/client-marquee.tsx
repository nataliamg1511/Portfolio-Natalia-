"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import type { Client } from "@/lib/types";

const LOGO_TILE_CLASS =
  "flex h-20 w-36 shrink-0 items-center justify-center rounded-[0.25rem] border border-border bg-background p-4 transition-transform duration-180 ease-[cubic-bezier(0.3,0,0,1)] hover:scale-105 md:h-24 md:w-44";

interface ClientMarqueeProps {
  clients: Client[];
}

function LogoTile({ client }: { client: Client }) {
  return (
    <div className={LOGO_TILE_CLASS}>
      <div className="relative h-full w-full">
        <Image src={client.logo_url} alt={client.logo_alt} fill sizes="176px" className="object-contain" />
      </div>
    </div>
  );
}

/**
 * Vitrine de logos de clientes ("Pra quem já escrevi") — fecho visual da
 * Home, depois do grid de projetos. Slider horizontal infinito (uma faixa
 * contínua, desacelera no hover); os itens não são clicáveis. Logos têm
 * fundos/proporções variados, então cada uma vive num tile neutro com
 * padding e hairline. Respeita `prefers-reduced-motion`: vira lista
 * estática, sem animação.
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
                <LogoTile client={client} />
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
      <div className="mt-10">
        <InfiniteSlider gap={40} duration={60} durationOnHover={180}>
          {clients.map((client) => (
            <LogoTile key={client.id} client={client} />
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
