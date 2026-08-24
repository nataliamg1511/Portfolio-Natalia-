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

export type ProjectSectionKind = "text" | "video" | "link";

/**
 * Bloco de conteúdo de um case, na ordem definida no admin. Substitui os
 * quatro campos fixos (contexto/desafio/solução/resultado): agora cada seção
 * tem título editável e pode ser removida, e além de texto existem seções de
 * vídeo incorporado (YouTube/Vimeo) e de link.
 */
export interface ProjectSection {
  id: string;
  project_id: string;
  kind: ProjectSectionKind;
  /** Título da seção (texto), rótulo do link, ou legenda do vídeo. Opcional. */
  title: string;
  /** Corpo da seção de texto — aceita formatação estilo markdown. */
  body: string;
  /** URL do vídeo (kind "video") ou do link (kind "link"). */
  url: string;
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
