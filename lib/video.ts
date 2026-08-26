/**
 * Converte URLs de YouTube/Vimeo em URL de embed (iframe). Retorna null para
 * qualquer outra URL — nesse caso o case mostra um link normal em vez de
 * player incorporado.
 */
/**
 * URL aponta pra um arquivo de vídeo direto (upload no Storage ou link
 * externo .mp4 etc.)? Nesse caso o case renderiza um <video> nativo em vez
 * de iframe de YouTube/Vimeo.
 */
export function isVideoFileUrl(url: string): boolean {
  try {
    const pathname = url.startsWith("/") ? url : new URL(url).pathname;
    return /\.(mp4|webm|mov|m4v|ogv)$/i.test(pathname);
  } catch {
    return false;
  }
}

/**
 * Fonte do <video> com fragmento `#t=0.001`: força o navegador (em especial
 * o Safari do iOS e o Chrome Android, que não pintam nada com só
 * `preload="metadata"`) a buscar o primeiro quadro e exibi-lo como preview.
 */
export function videoPreviewSrc(url: string): string {
  return url.includes("#") ? url : `${url}#t=0.001`;
}

export function getVideoEmbedUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname === "/watch") {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    const path = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{6,})/);
    return path ? `https://www.youtube-nocookie.com/embed/${path[1]}` : null;
  }

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1).split("/")[0];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (host === "vimeo.com") {
    const id = parsed.pathname.match(/^\/(\d+)/);
    return id ? `https://player.vimeo.com/video/${id[1]}` : null;
  }

  if (host === "player.vimeo.com") {
    const id = parsed.pathname.match(/^\/video\/(\d+)/);
    return id ? url : null;
  }

  return null;
}
