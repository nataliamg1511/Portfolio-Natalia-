import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

/**
 * Cliente Supabase anônimo, SEM cookies/sessão — seguro para uso em
 * geração estática (generateStaticParams, páginas com `revalidate`,
 * sitemap). As leituras públicas dependem só das policies de RLS para
 * conteúdo publicado. Retorna `null` quando o Supabase não está
 * configurado — quem chama cai no fallback local (ver lib/data/*.ts).
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
