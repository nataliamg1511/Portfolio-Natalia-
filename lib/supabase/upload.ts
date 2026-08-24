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

/** Teto do plano free do Supabase Storage (50 MB por arquivo). */
export const MAX_VIDEO_SIZE_MB = 50;

/**
 * Envia um arquivo de vídeo (.mp4/.webm/.mov) para o mesmo bucket. Retorna
 * a URL pública, ou `{ error }` com mensagem pronta pra mostrar no toast.
 */
export async function uploadProjectVideo(
  file: File
): Promise<{ url: string } | { error: string }> {
  if (!file.type.startsWith("video/")) {
    return { error: "Escolha um arquivo de vídeo (.mp4, .webm ou .mov)." };
  }
  if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
    return {
      error: `O vídeo tem ${(file.size / 1024 / 1024).toFixed(0)} MB — o limite é ${MAX_VIDEO_SIZE_MB} MB. Comprima o arquivo ou use um link do YouTube/Vimeo.`,
    };
  }

  const url = await uploadProjectImage(file, "videos");
  if (!url) return { error: "Não foi possível enviar o vídeo. Conecte o Supabase (ver CLAUDE.md)." };
  return { url };
}
