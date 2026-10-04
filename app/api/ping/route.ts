import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Keep-alive do Supabase. O plano gratuito pausa o projeto depois de 7 dias
 * sem atividade no banco, e as páginas públicas usam `revalidate` — sem
 * visitas, ninguém consulta o Postgres. O cron da Vercel (ver vercel.json)
 * chama esta rota todo dia para fazer uma leitura real e manter o projeto
 * acordado.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // A Vercel envia `Authorization: Bearer <CRON_SECRET>` nas chamadas de cron
  // quando a variável existe. Sem ela configurada, a rota fica aberta — ela
  // só faz uma leitura e não devolve nenhum dado do banco.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, supabase: "not-configured" });
  }

  const { error } = await supabase.from("projects").select("id").limit(1);
  if (error) {
    console.error("[ping] Supabase não respondeu:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 503 });
  }

  return NextResponse.json({ ok: true, supabase: "alive", at: new Date().toISOString() });
}
