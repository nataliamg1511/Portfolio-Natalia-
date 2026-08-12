"use client";

import { useEffect } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ArrowLink } from "@/components/ui/arrow-link";

/**
 * Error boundary raiz das rotas públicas. Captura erros de renderização não
 * tratados e evita a tela branca padrão do Next.js — mesma linguagem visual
 * do not-found.tsx (DESIGN_SYSTEM.md).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="container-editorial flex flex-col items-start py-32 md:py-48">
        <p className="meta-text">Erro inesperado</p>
        <h1 className="font-display mt-4 text-4xl font-medium tracking-[-0.015em] text-foreground md:text-5xl">
          Algo deu errado.
        </h1>
        <p className="mt-4 max-w-md text-[1.0625rem] leading-[1.65] text-muted-foreground">
          Não conseguimos carregar essa página agora. Tenta de novo em instantes.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors duration-180 hover:bg-primary/90 active:translate-y-px"
          >
            Tentar de novo
          </button>
          <ArrowLink href="/">Voltar para a home</ArrowLink>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
