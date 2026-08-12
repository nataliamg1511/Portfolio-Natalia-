import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { seedProjects } from "@/lib/data/seed";
import type { GalleryImage, Project, ProjectStatus } from "@/lib/types";

function sortByOrder<T extends { display_order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.display_order - b.display_order);
}

/**
 * Home pública: só projetos publicados, ordenados por display_order.
 * Usa o cliente público (sem cookies) porque roda em geração estática.
 */
export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = createPublicClient();

  if (!supabase) {
    return sortByOrder(seedProjects.filter((p) => p.status === "published"));
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*, project_gallery_images(*)")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("[getPublishedProjects]", error?.message);
    return sortByOrder(seedProjects.filter((p) => p.status === "published"));
  }

  return data.map(mapProjectRow);
}

/**
 * Página de case: busca por slug, só retorna se publicado.
 * Usa o cliente público (sem cookies) porque roda em geração estática.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createPublicClient();

  if (!supabase) {
    const found = seedProjects.find((p) => p.slug === slug && p.status === "published");
    return found ?? null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*, project_gallery_images(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return mapProjectRow(data);
}

/** Admin: lista tudo (publicado e rascunho), ordenado por display_order. */
export async function getAllProjectsAdmin(): Promise<{ projects: Project[]; usingFallback: boolean }> {
  const supabase = await createClient();

  if (!supabase) {
    return { projects: sortByOrder(seedProjects), usingFallback: true };
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*, project_gallery_images(*)")
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("[getAllProjectsAdmin]", error?.message);
    return { projects: sortByOrder(seedProjects), usingFallback: true };
  }

  return { projects: data.map(mapProjectRow), usingFallback: false };
}

export async function getProjectByIdAdmin(id: string): Promise<Project | null> {
  const supabase = await createClient();

  if (!supabase) {
    return seedProjects.find((p) => p.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*, project_gallery_images(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapProjectRow(data);
}

export interface ProjectInput {
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
}

export async function createProject(input: ProjectInput) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Conecte o Supabase para criar projetos de verdade." };
  }

  const { data: maxOrderRow } = await supabase
    .from("projects")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxOrderRow?.display_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...input, display_order: nextOrder })
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, project: mapProjectRow(data) };
}

export async function updateProject(id: string, input: ProjectInput) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Conecte o Supabase para editar projetos de verdade." };
  }

  const { data, error } = await supabase
    .from("projects")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, project: mapProjectRow(data) };
}

export interface GalleryImageInput {
  image_url: string;
  alt_text: string;
}

/** Substitui toda a galeria de um projeto (mais simples que CRUD incremental). */
export async function replaceProjectGallery(projectId: string, images: GalleryImageInput[]) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Conecte o Supabase para gerenciar a galeria de verdade." };
  }

  const { error: deleteError } = await supabase
    .from("project_gallery_images")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) return { ok: false as const, error: deleteError.message };

  if (images.length === 0) return { ok: true as const };

  const rows = images.map((image, index) => ({
    project_id: projectId,
    image_url: image.image_url,
    alt_text: image.alt_text,
    display_order: index + 1,
  }));

  const { error: insertError } = await supabase.from("project_gallery_images").insert(rows);
  if (insertError) return { ok: false as const, error: insertError.message };
  return { ok: true as const };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Conecte o Supabase para excluir projetos de verdade." };
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function toggleProjectStatus(id: string, status: ProjectStatus) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Conecte o Supabase para publicar/despublicar de verdade." };
  }

  const { error } = await supabase.from("projects").update({ status }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

/** Troca a ordem de dois projetos vizinhos (subir/descer). */
export async function swapProjectOrder(idA: string, orderA: number, idB: string, orderB: number) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Conecte o Supabase para reordenar de verdade." };
  }

  const [resA, resB] = await Promise.all([
    supabase.from("projects").update({ display_order: orderB }).eq("id", idA),
    supabase.from("projects").update({ display_order: orderA }).eq("id", idB),
  ]);

  if (resA.error) return { ok: false as const, error: resA.error.message };
  if (resB.error) return { ok: false as const, error: resB.error.message };
  return { ok: true as const };
}

export function isFallbackMode() {
  return !isSupabaseConfigured();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProjectRow(row: any): Project {
  const gallery: GalleryImage[] = (row.project_gallery_images ?? [])
    .map((g: GalleryImage) => ({
      id: g.id,
      project_id: g.project_id,
      image_url: g.image_url,
      alt_text: g.alt_text,
      display_order: g.display_order,
    }))
    .sort((a: GalleryImage, b: GalleryImage) => a.display_order - b.display_order);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    year: row.year,
    client: row.client,
    award: row.award,
    cover_image_url: row.cover_image_url,
    cover_image_alt: row.cover_image_alt ?? row.title,
    hover_image_url: row.hover_image_url,
    hover_image_alt: row.hover_image_alt,
    context_text: row.context_text,
    challenge_text: row.challenge_text,
    solution_text: row.solution_text,
    result_text: row.result_text,
    status: row.status,
    display_order: row.display_order,
    gallery,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
