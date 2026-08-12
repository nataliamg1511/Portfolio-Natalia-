/**
 * O Supabase real da Natália ainda não existe (ela criará a conta gratuita
 * depois — ver CLAUDE.md). Enquanto NEXT_PUBLIC_SUPABASE_URL e
 * NEXT_PUBLIC_SUPABASE_ANON_KEY não estiverem preenchidas, todo o site usa
 * o conteúdo seed local (lib/data/seed.ts) como fallback — assim `npm run
 * dev` já mostra o site completo hoje, sem backend nenhum configurado.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && url.trim().length > 0 && anonKey && anonKey.trim().length > 0);
}
