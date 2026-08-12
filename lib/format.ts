export function formatMeta(parts: Array<string | number | null | undefined>): string {
  return parts.filter(Boolean).join(" · ");
}

/**
 * Trunca texto para uso em meta description / OG description (limite
 * recomendado ~155-160 caracteres para não cortar no Google/redes sociais).
 * Corta na última palavra completa antes do limite, sem afetar o texto
 * exibido na página — só o usado nas tags de SEO.
 */
export function truncateForMeta(text: string, maxLength = 155): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const cut = trimmed.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength - 1)}…`;
}

export function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function whatsappLink(number: string, text?: string): string {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
