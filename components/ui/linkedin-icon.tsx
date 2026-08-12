import type { SVGProps } from "react";

interface LinkedinIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * Ícone de LinkedIn — a versão instalada de `lucide-react` (1.x) removeu os
 * ícones de marca (Linkedin, Github, Twitter etc.), então mantemos aqui uma
 * versão local no mesmo grid 24x24 / estilo stroke da lucide-react
 * (originada do ícone "linkedin" do Feather Icons, base histórica da
 * lucide) — evita adicionar uma dependência nova só por um ícone.
 */
export function LinkedinIcon({ size = 24, strokeWidth = 2, className, ...props }: LinkedinIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
