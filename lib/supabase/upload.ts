"use client";

import { createClient } from "@/lib/supabase/client";

const BUCKET = "project-images";

/**
 * Envia um arquivo para o bucket `project-images` do Supabase Storage.
 * Retorna `null` (e quem chama deve tratar) quando o Supabase ainda não
 * está configurado.
 */
export async function uploadProjectImage(file: File, folder: string): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("[uploadProjectImage]", error.message);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
