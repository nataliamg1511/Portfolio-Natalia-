import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Message } from "@/lib/types";

export interface SendMessageInput {
  name: string;
  email: string;
  message: string;
}

/**
 * Envia mensagem do formulário de contato. Sem Supabase configurado, a
 * mensagem não é persistida em lugar nenhum — simulamos sucesso (a
 * experiência da visitante do site não pode depender do backend existir),
 * mas deixamos isso explícito no retorno para logging/observabilidade.
 */
export async function sendMessage(input: SendMessageInput) {
  const supabase = await createClient();

  if (!supabase) {
    return { ok: true as const, simulated: true };
  }

  const { error } = await supabase.from("messages").insert({
    name: input.name,
    email: input.email,
    message: input.message,
  });

  if (error) {
    return { ok: false as const, error: error.message, simulated: false };
  }

  return { ok: true as const, simulated: false };
}

export async function getMessages(): Promise<{ messages: Message[]; usingFallback: boolean }> {
  const supabase = await createClient();

  if (!supabase) {
    return { messages: [], usingFallback: true };
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[getMessages]", error?.message);
    return { messages: [], usingFallback: true };
  }

  return { messages: data, usingFallback: false };
}

export async function markMessageAsRead(id: string) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Conecte o Supabase para gerenciar mensagens de verdade." };
  }

  const { error } = await supabase.from("messages").update({ is_read: true }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
