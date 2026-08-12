"use client";

/**
 * Footer público — "↑ Voltar ao topo" + copyright, sem borda superior
 * (silêncio visual total). DESIGN_SYSTEM.md seção 7.6.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  function scrollToTop() {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <footer className="py-16">
      <div className="container-editorial flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={scrollToTop}
          className="link-underline inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-180 hover:text-foreground"
        >
          <span className="arrow-up" aria-hidden>
            ↑
          </span>
          <span>Voltar ao topo</span>
        </button>
        <p className="text-xs text-muted-foreground">© {year} Natália Machado. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
