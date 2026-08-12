"use server";

import { revalidatePath } from "next/cache";
import { projectSchema } from "@/lib/validation/project";
import {
  createProject,
  replaceProjectGallery,
  updateProject,
  type ProjectInput,
} from "@/lib/data/projects";

export interface ProjectFormState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  projectId?: string;
}

export interface GalleryItemPayload {
  image_url: string;
  alt_text: string;
}

function parseInput(formData: FormData) {
  const raw = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    category: String(formData.get("category") ?? ""),
    year: String(formData.get("year") ?? ""),
    client: String(formData.get("client") ?? ""),
    award: String(formData.get("award") ?? ""),
    cover_image_url: String(formData.get("cover_image_url") ?? ""),
    cover_image_alt: String(formData.get("cover_image_alt") ?? ""),
    hover_image_url: String(formData.get("hover_image_url") ?? ""),
    hover_image_alt: String(formData.get("hover_image_alt") ?? ""),
    context_text: String(formData.get("context_text") ?? ""),
    challenge_text: String(formData.get("challenge_text") ?? ""),
    solution_text: String(formData.get("solution_text") ?? ""),
    result_text: String(formData.get("result_text") ?? ""),
    status: String(formData.get("status") ?? "draft"),
  };

  const galleryRaw = String(formData.get("gallery") ?? "[]");
  let gallery: GalleryItemPayload[] = [];
  try {
    gallery = JSON.parse(galleryRaw);
  } catch {
    gallery = [];
  }

  return { raw, gallery };
}

export async function saveProjectAction(
  projectId: string | null,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const { raw, gallery } = parseInput(formData);

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Confira os campos destacados.", fieldErrors };
  }

  const input: ProjectInput = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    category: parsed.data.category,
    year: parsed.data.year,
    client: parsed.data.client || null,
    award: parsed.data.award || null,
    cover_image_url: parsed.data.cover_image_url,
    cover_image_alt: parsed.data.cover_image_alt,
    hover_image_url: parsed.data.hover_image_url || null,
    hover_image_alt: parsed.data.hover_image_alt || null,
    context_text: parsed.data.context_text,
    challenge_text: parsed.data.challenge_text,
    solution_text: parsed.data.solution_text,
    result_text: parsed.data.result_text,
    status: parsed.data.status,
  };

  const result = projectId ? await updateProject(projectId, input) : await createProject(input);

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  const finalId = "project" in result ? result.project.id : projectId!;

  const galleryResult = await replaceProjectGallery(
    finalId,
    gallery.filter((g) => g.image_url)
  );

  if (!galleryResult.ok) {
    return { ok: false, error: galleryResult.error, projectId: finalId };
  }

  revalidatePath("/admin/projetos");
  revalidatePath("/");
  revalidatePath(`/projetos/${parsed.data.slug}`);

  return { ok: true, projectId: finalId };
}
