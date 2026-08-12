"use server";

import { revalidatePath } from "next/cache";
import {
  deleteProject,
  getAllProjectsAdmin,
  swapProjectOrder,
  toggleProjectStatus,
} from "@/lib/data/projects";

export async function toggleStatusAction(id: string, nextStatus: "draft" | "published") {
  const result = await toggleProjectStatus(id, nextStatus);
  revalidatePath("/admin/projetos");
  revalidatePath("/");
  return result;
}

export async function deleteProjectAction(id: string) {
  const result = await deleteProject(id);
  revalidatePath("/admin/projetos");
  revalidatePath("/");
  return result;
}

export async function moveProjectAction(id: string, direction: "up" | "down") {
  const { projects } = await getAllProjectsAdmin();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return { ok: false as const, error: "Projeto não encontrado." };

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= projects.length) {
    return { ok: true as const };
  }

  const current = projects[index];
  const target = projects[targetIndex];

  const result = await swapProjectOrder(
    current.id,
    current.display_order,
    target.id,
    target.display_order
  );

  revalidatePath("/admin/projetos");
  revalidatePath("/");
  return result;
}
