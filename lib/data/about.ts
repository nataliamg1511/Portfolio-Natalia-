import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { seedAbout } from "@/lib/data/seed";
import type { About } from "@/lib/types";

/** Leitura pública — cliente sem cookies, seguro em geração estática. */
export async function getAbout(): Promise<{ about: About; usingFallback: boolean }> {
  const supabase = createPublicClient();

  if (!supabase) {
    return { about: seedAbout, usingFallback: true };
  }

  const { data, error } = await supabase.from("about").select("*").maybeSingle();

  if (error || !data) {
    console.error("[getAbout]", error?.message);
    return { about: seedAbout, usingFallback: true };
  }

  return {
    about: {
      id: data.id,
      photo_url: data.photo_url ?? seedAbout.photo_url,
      photo_alt: data.photo_alt ?? seedAbout.photo_alt,
      // `?? "50% 50%"` cobre o período antes da migration 0004 rodar em
      // produção — sem a coluna, `select("*")` não traz o campo.
      photo_position: data.photo_position ?? "50% 50%",
      bio_main_text: data.bio_main_text ?? "",
      bio_secondary_text: data.bio_secondary_text ?? "",
      clients: data.clients ?? [],
      tools: data.tools ?? [],
      resume_url: data.resume_url ?? "",
      linkedin_url: data.linkedin_url ?? seedAbout.linkedin_url,
      email: data.email ?? seedAbout.email,
      whatsapp_number: data.whatsapp_number ?? seedAbout.whatsapp_number,
      updated_at: data.updated_at,
    },
    usingFallback: false,
  };
}

export interface AboutInput {
  photo_url: string;
  photo_alt: string;
  photo_position: string;
  bio_main_text: string;
  bio_secondary_text: string;
  clients: string[];
  tools: string[];
  resume_url: string;
  linkedin_url: string;
  email: string;
  whatsapp_number: string;
}

export async function updateAbout(id: string, input: AboutInput) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Conecte o Supabase para salvar as alterações de verdade." };
  }

  const { error } = await supabase.from("about").update(input).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
