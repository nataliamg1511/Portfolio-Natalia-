import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface ArrowLinkProps extends ComponentProps<typeof Link> {
  className?: string;
}

/**
 * Link de ação com seta e sublinhado de assinatura ("Ver projeto →",
 * "Sobre mim →", "Enviar →") — ver DESIGN_SYSTEM.md seção 6.2. A seta é
 * renderizada à parte (não embutida no texto) para receber o
 * micro-deslocamento de hover/focus sem afetar o sublinhado do texto.
 */
export function ArrowLink({ className, children, ...props }: ArrowLinkProps) {
  return (
    <Link
      className={cn(
        "link-underline inline-flex items-center gap-1.5 font-sans text-sm font-medium text-foreground",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <span className="arrow-trailing" aria-hidden>
        →
      </span>
    </Link>
  );
}
