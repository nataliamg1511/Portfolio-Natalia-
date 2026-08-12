"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/#projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

/**
 * Header fixo do site público — DESIGN_SYSTEM.md seção 7.1. Sem borda até
 * scroll > 8px, para não competir com o hero. Nav visível por completo em
 * qualquer largura (nunca hambúrguer — só 3 itens).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-[100] focus-visible:rounded-sm focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
      >
        Pular para o conteúdo
      </a>
      <header
        className={cn(
          "sticky top-0 z-50 h-[72px] transition-[background-color,backdrop-filter,border-color] duration-180 ease-[cubic-bezier(0.3,0,0,1)]",
          scrolled
            ? "border-b border-border bg-background/95 backdrop-blur"
            : "border-b border-transparent bg-transparent backdrop-blur-none"
        )}
      >
        <div className="container-editorial flex h-full items-center justify-between">
          <Link href="/" className="font-sans text-[0.9375rem] font-semibold text-foreground">
            Natália Machado
          </Link>
          <nav aria-label="Navegação principal" className="flex items-center gap-6 sm:gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/#projetos" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "link-underline text-sm font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
