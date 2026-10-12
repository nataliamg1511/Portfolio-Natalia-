import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Keep-alive do Supabase. O plano gratuito pausa o projeto quando ele não
 * recebe "algumas requisições de usuário ao banco por dia" ao longo de 7
 * dias, e as páginas públicas usam `revalidate` — sem visitas, ninguém
 * consulta o Postgres. Uma leitura por dia não basta (o projeto continuou
 * pausando), então cada chamada faz várias leituras reais e a rota é
 * chamada várias vezes ao dia por dois agendadores independentes: os crons
 * da Vercel (vercel.json) e o GitHub Actions
 * (.github/workflows/supabase-keepalive.yml).
 */
export const dynamic = "force-dynamic";

const TABLES = ["projects", "project_sections", "about", "clients"] as const;

export async function GET(request: NextRequest) {
  // A Vercel envia `Authorization: Bearer <CRON_SECRET>` nas chamadas de cron
  // quando a variável existe. Sem ela configurada, a rota fica aberta — ela
  // só faz leituras e não devolve nenhum dado do banco.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, supabase: "not-configured" });
  }

  const results = await Promise.all(
    TABLES.map(async (table) => {
      const { error } = await supabase.from(table).select("*", { count: "exact" }).limit(1);
      return { table, error: error?.message ?? null };
    })
  );
  const failed = results.filter((r) => r.error);
  const queries = results.length - failed.length;

  // Identifica nos logs da Vercel quem chamou (cron da Vercel, GitHub Actions
  // ou acesso manual) — é o que permite conferir se os agendamentos rodam.
  const source =
    request.headers.get("x-vercel-cron-schedule") ??
    request.headers.get("x-keepalive-source") ??
    "manual";
  console.log(`[ping] origem=${source} consultas_ok=${queries}/${results.length}`);

  // Uma tabela ausente (migration não rodada) não derruba o ping: só é
  // falha quando nenhuma consulta chega ao banco.
  if (queries === 0) {
    console.error("[ping] Supabase não respondeu:", failed[0]?.error);
    return NextResponse.json(
      { ok: false, error: failed[0]?.error ?? "sem resposta" },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    supabase: "alive",
    queries,
    at: new Date().toISOString(),
  });
}
