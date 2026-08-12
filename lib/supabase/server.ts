import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

/**
 * Cliente Supabase para uso em Server Components, Route Handlers e Server
 * Actions. Retorna `null` quando o projeto ainda não tem Supabase
 * configurado — quem chama precisa tratar esse caso e cair no fallback
 * local (ver lib/data/*.ts).
 */
export async function createClient() {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado a partir de um Server Component sem permissão de
            // escrita de cookies — seguro ignorar quando há middleware
            // atualizando a sessão.
          }
        },
      },
    }
  );
}
