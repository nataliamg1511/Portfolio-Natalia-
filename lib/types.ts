export type ProjectStatus = "draft" | "published";

export interface GalleryImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
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
  hover_image_url: string | null;
  hover_image_alt: string | null;
  context_text: string;
  challenge_text: string;
  solution_text: string;
  result_text: string;
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
