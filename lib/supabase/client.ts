import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

/**
 * Cliente Supabase para uso em Client Components. Retorna `null` quando o
 * projeto ainda não tem Supabase configurado (ver is-configured.ts) — quem
 * chama precisa tratar esse caso e cair no fallback local.
 */
export function createClient() {
  if (!isSupabaseConfigured()) return null;

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
