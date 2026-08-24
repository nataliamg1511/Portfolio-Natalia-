export type ProjectStatus = "draft" | "published";

export interface GalleryImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  /** `object-position` CSS ("X% Y%") — imagem renderizada com crop fixo (4:3) no case. */
  position: string;
  display_order: number;
}

export type ProjectSectionKind = "text" | "video" | "link" | "image" | "carousel";

/** Largura do bloco na página do case. */
export type SectionLayout = "small" | "contained" | "wide" | "half" | "full";

/** Alinhamento horizontal do bloco quando ele é mais estreito que a página. */
export type SectionAlign = "left" | "center" | "right";

/** Orientação de vídeo ("" = legado, tratado como horizontal 16:9). */
export type VideoAspect = "16:9" | "9:16" | "";

/**
 * Proporção de corte de um bloco de mídia. Em vídeo, orientação do player
 * (16:9/9:16). Em imagem, o crop escolhido — "" = original, sem corte.
 */
export type SectionAspect = "" | "16:9" | "9:16" | "1:1" | "4:3" | "3:4";

/** Item de um bloco carrossel — imagem ou vídeo, exibidos lado a lado. */
export interface CarouselItem {
  type: "image" | "video";
  /** URL da imagem, do arquivo de vídeo ou do embed YouTube/Vimeo. */
  url: string;
  /** Texto alternativo (imagens). */
  alt: string;
  /** Orientação do vídeo; ignorado em imagens (proporção natural). */
  aspect: VideoAspect;
}

/**
 * Bloco de conteúdo de um case, na ordem definida no admin (arrastável).
 * Além de texto, vídeo (YouTube/Vimeo ou arquivo) e link, imagens também
 * são blocos — o que permite posicionar cada peça exatamente onde ela deve
 * aparecer e escolher largura/alinhamento por bloco.
 */
export interface ProjectSection {
  id: string;
  project_id: string;
  kind: ProjectSectionKind;
  /** Título da seção (texto), rótulo do link, ou legenda do vídeo/imagem. Opcional. */
  title: string;
  /** Corpo da seção de texto — aceita formatação estilo markdown. */
  body: string;
  /** URL do vídeo (kind "video"), do link (kind "link") ou da imagem (kind "image"). */
  url: string;
  /** Texto alternativo da imagem (kind "image"). */
  image_alt: string;
  layout: SectionLayout;
  align: SectionAlign;
  /** `object-position` CSS ("X% Y%") da imagem (kind "image"). */
  position: string;
  /** Orientação do vídeo (kind "video") ou corte da imagem (kind "image"). */
  aspect: SectionAspect;
  /** Itens do carrossel (kind "carousel"). */
  items: CarouselItem[];
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number;
  client: string | null;
  award: string | null;
  cover_image_url: string;
  cover_image_alt: string;
  /** `object-position` CSS ("X% Y%") — enquadramento escolhido no admin. */
  cover_image_position: string;
  hover_image_url: string | null;
  hover_image_alt: string | null;
  /** `object-position` CSS ("X% Y%") — enquadramento escolhido no admin. */
  hover_image_position: string;
  sections: ProjectSection[];
  status: ProjectStatus;
  display_order: number;
  gallery?: GalleryImage[];
  created_at: string;
  updated_at: string;
}

/**
 * Cliente/marca exibido na vitrine de logos da Home ("Pra quem já escrevi").
 * Independente do array `About.clients` (tags de texto em /sobre) — aqui é
 * a logo em si, com sua própria ordem de exibição.
 */
export interface Client {
  id: string;
  name: string;
  logo_url: string;
  logo_alt: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface About {
  id: string;
  photo_url: string;
  photo_alt: string;
  /** `object-position` CSS ("X% Y%") — enquadramento escolhido no admin. */
  photo_position: string;
  bio_main_text: string;
  bio_secondary_text: string;
  clients: string[];
  tools: string[];
  resume_url: string;
  linkedin_url: string;
  email: string;
  whatsapp_number: string;
  updated_at: string;
}

export interface DataResult<T> {
  data: T;
  usingFallback: boolean;
  error?: string;
}
