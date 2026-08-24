import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { seedProjects } from "@/lib/data/seed";
import type { GalleryImage, Project, ProjectSection, ProjectStatus } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

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
    return found ? withDerivedImageSections(found) : null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*, project_gallery_images(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  await attachSections(supabase, data);
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
    const found = seedProjects.find((p) => p.id === id);
    return found ? withDerivedImageSections(found) : null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*, project_gallery_images(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  await attachSections(supabase, data);
  return mapProjectRow(data);
}

/**
 * Busca as seções do case numa query separada (não no `select` principal):
 * se a migration 0005 ainda não rodou, a tabela não existe e o erro é
 * ignorado — mapProjectRow deriva as seções das colunas antigas
 * (context/challenge/solution/result) e o site continua no ar.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function attachSections(supabase: SupabaseClient, row: any) {
  const { data, error } = await supabase
    .from("project_sections")
    .select("*")
    .eq("project_id", row.id)
    .order("display_order", { ascending: true });

  if (!error && data) row.project_sections = data;
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
  cover_image_position: string;
  hover_image_url: string | null;
  hover_image_alt: string | null;
  hover_image_position: string;
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

export interface ProjectSectionInput {
  kind: "text" | "video" | "link" | "image";
  title: string;
  body: string;
  url: string;
  image_alt: string;
  layout: "contained" | "wide" | "half" | "full";
  align: "left" | "center" | "right";
  position: string;
}

/** Substitui todas as seções de conteúdo de um case (mesmo padrão da galeria). */
export async function replaceProjectSections(projectId: string, sections: ProjectSectionInput[]) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Conecte o Supabase para gerenciar o conteúdo de verdade." };
  }

  const { error: deleteError } = await supabase
    .from("project_sections")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) {
    return {
      ok: false as const,
      error: `${deleteError.message} — se a tabela project_sections não existe, rode supabase/migrations/0005_secoes_de_case.sql no SQL Editor.`,
    };
  }

  if (sections.length === 0) return { ok: true as const };

  const rows = sections.map((section, index) => ({
    project_id: projectId,
    kind: section.kind,
    title: section.title,
    body: section.body,
    url: section.url,
    image_alt: section.image_alt,
    layout: section.layout,
    align: section.align,
    position: section.position || "50% 50%",
    display_order: index + 1,
  }));

  const { error: insertError } = await supabase.from("project_sections").insert(rows);
  if (insertError) {
    return {
      ok: false as const,
      error: `${insertError.message} — se faltarem colunas (image_alt/layout/align) ou o tipo "image" for rejeitado, rode supabase/migrations/0007_blocos_de_case.sql no SQL Editor.`,
    };
  }
  return { ok: true as const };
}

export interface GalleryImageInput {
  image_url: string;
  alt_text: string;
  position: string;
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
    position: image.position || "50% 50%",
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
  // `?? "50% 50%"` é crítico aqui: se a migration 0004 (colunas de posição)
  // ainda não tiver rodado no Supabase de produção, `select("*")` simplesmente
  // não traz esses campos (undefined) — sem o fallback, o site quebraria.
  const gallery: GalleryImage[] = (row.project_gallery_images ?? [])
    .map((g: GalleryImage) => ({
      id: g.id,
      project_id: g.project_id,
      image_url: g.image_url,
      alt_text: g.alt_text,
      position: g.position ?? "50% 50%",
      display_order: g.display_order,
    }))
    .sort((a: GalleryImage, b: GalleryImage) => a.display_order - b.display_order);

  return withDerivedImageSections({
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    year: row.year,
    client: row.client,
    award: row.award,
    cover_image_url: row.cover_image_url,
    cover_image_alt: row.cover_image_alt ?? row.title,
    cover_image_position: row.cover_image_position ?? "50% 50%",
    hover_image_url: row.hover_image_url,
    hover_image_alt: row.hover_image_alt,
    hover_image_position: row.hover_image_position ?? "50% 50%",
    sections: mapSections(row),
    status: row.status,
    display_order: row.display_order,
    gallery,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
}

/**
 * Compatibilidade com a era da "galeria intercalada" (pré-migration 0007 e
 * seed local): se o case ainda não tem nenhum bloco de imagem mas tem galeria,
 * converte as imagens em blocos `image` na mesma posição em que o site as
 * renderizava — imagem N logo depois da seção N, excedentes no final. Com a
 * 0007 rodada (ou depois do primeiro salvar no admin novo), as imagens já
 * chegam como blocos e esta função não muda nada.
 */
function withDerivedImageSections(project: Project): Project {
  const gallery = project.gallery ?? [];
  if (gallery.length === 0 || project.sections.some((s) => s.kind === "image")) {
    return project;
  }

  const merged: ProjectSection[] = [];
  const toImageSection = (image: GalleryImage): ProjectSection => ({
    id: `${image.id}-as-section`,
    project_id: project.id,
    kind: "image",
    title: "",
    body: "",
    url: image.image_url,
    image_alt: image.alt_text,
    layout: "wide",
    align: "center",
    position: image.position || "50% 50%",
    display_order: 0,
  });

  project.sections.forEach((section, index) => {
    merged.push(section);
    if (gallery[index]) merged.push(toImageSection(gallery[index]));
  });
  merged.push(...gallery.slice(project.sections.length).map(toImageSection));

  return {
    ...project,
    sections: merged.map((section, index) => ({ ...section, display_order: index + 1 })),
  };
}

/**
 * Seções do case: usa as linhas de `project_sections` quando vieram na row
 * (attachSections). Sem elas — migration 0005 não rodou, ou é uma listagem
 * que não precisa do conteúdo — deriva das colunas antigas
 * context/challenge/solution/result com os títulos clássicos, pulando as
 * vazias (a 0005 esvazia essas colunas ao migrar, então não há duplicação).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSections(row: any): ProjectSection[] {
  if (Array.isArray(row.project_sections)) {
    return row.project_sections
      .map((s: ProjectSection) => ({
        id: s.id,
        project_id: s.project_id,
        kind: s.kind ?? "text",
        title: s.title ?? "",
        body: s.body ?? "",
        url: s.url ?? "",
        // `??` cobre o período pré-migration 0007 (colunas ainda não existem).
        image_alt: s.image_alt ?? "",
        layout: s.layout ?? (s.kind === "text" ? "contained" : "wide"),
        align: s.align ?? "center",
        position: s.position ?? "50% 50%",
        display_order: s.display_order,
      }))
      .sort((a: ProjectSection, b: ProjectSection) => a.display_order - b.display_order);
  }

  const legacy: Array<[title: string, body: string | null | undefined]> = [
    ["Contexto do cliente", row.context_text],
    ["O desafio", row.challenge_text],
    ["A solução criativa", row.solution_text],
    ["O resultado", row.result_text],
  ];

  return legacy
    .filter(([, body]) => typeof body === "string" && body.trim().length > 0)
    .map(([title, body], index) => ({
      id: `${row.id}-legacy-${index + 1}`,
      project_id: row.id,
      kind: "text" as const,
      title,
      body: body as string,
      url: "",
      image_alt: "",
      layout: "contained" as const,
      align: "center" as const,
      position: "50% 50%",
      display_order: index + 1,
    }));
}
