import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { seedClients } from "@/lib/data/seed";
import type { Client } from "@/lib/types";

function sortByOrder(items: Client[]): Client[] {
  return [...items].sort((a, b) => a.display_order - b.display_order);
}

/**
 * Logos de clientes — sem conceito de rascunho/publicado (diferente de
 * `projects`), então esta mesma função serve a Home (geração estática, por
 * isso o cliente público sem cookies) e a listagem do admin.
 */
export async function getClients(): Promise<{ clients: Client[]; usingFallback: boolean }> {
  const supabase = createPublicClient();

  if (!supabase) {
    return { clients: sortByOrder(seedClients), usingFallback: true };
  }

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("[getClients]", error?.message);
    return { clients: sortByOrder(seedClients), usingFallback: true };
  }

  return { clients: data.map(mapClientRow), usingFallback: false };
}

export interface ClientInput {
  name: string;
  logo_url: string;
  logo_alt: string;
}

export async function createClientEntry(input: ClientInput) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Conecte o Supabase para adicionar clientes de verdade." };
  }

  const { data: maxOrderRow } = await supabase
    .from("clients")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxOrderRow?.display_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("clients")
    .insert({ ...input, display_order: nextOrder })
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, client: mapClientRow(data) };
}

export async function deleteClientEntry(id: string) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Conecte o Supabase para excluir clientes de verdade." };
  }

  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

/** Troca a ordem de dois clientes vizinhos (subir/descer). */
export async function swapClientOrder(idA: string, orderA: number, idB: string, orderB: number) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Conecte o Supabase para reordenar de verdade." };
  }

  const [resA, resB] = await Promise.all([
    supabase.from("clients").update({ display_order: orderB }).eq("id", idA),
    supabase.from("clients").update({ display_order: orderA }).eq("id", idB),
  ]);

  if (resA.error) return { ok: false as const, error: resA.error.message };
  if (resB.error) return { ok: false as const, error: resB.error.message };
  return { ok: true as const };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapClientRow(row: any): Client {
  return {
    id: row.id,
    name: row.name,
    logo_url: row.logo_url,
    logo_alt: row.logo_alt ?? row.name,
    display_order: row.display_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
