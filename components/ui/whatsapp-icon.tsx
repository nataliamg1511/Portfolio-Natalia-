import type { SVGProps } from "react";

interface WhatsappIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * Ícone de WhatsApp — mesma motivação do LinkedinIcon: a lucide-react não
 * traz ícones de marca, então mantemos uma versão local no grid 24x24 /
 * estilo stroke da lucide (balão de conversa + fone), sem dependência nova.
 */
export function WhatsappIcon({ size = 24, strokeWidth = 2, className, ...props }: WhatsappIconProps) {
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
      <path d="M3 21l1.65-4.95A8.96 8.96 0 0 1 3.6 12a9 9 0 1 1 9 9 8.96 8.96 0 0 1-4.05-1.05L3 21z" />
      <path d="M9.1 8.5c.2-.5.5-.5.8-.5h.6c.2 0 .4 0 .5.4.2.5.6 1.6.6 1.7 0 .1.1.3 0 .5l-.4.6c-.1.2-.2.3 0 .6a7 7 0 0 0 1.3 1.6c.6.5 1.2.8 1.4.9.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.5.7c.2.1.4.2.4.3 0 .2 0 .7-.2 1.2-.2.5-1.2 1-1.7 1-.4 0-1 .2-3.3-.8a11.3 11.3 0 0 1-3.3-3c-.3-.4-.9-1.3-.9-2.3 0-1 .5-1.5.9-1.9z" />
    </svg>
  );
}
