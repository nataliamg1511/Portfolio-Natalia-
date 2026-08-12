import type { Metadata } from "next";
import { FallbackBanner } from "@/components/admin/fallback-banner";
import { ClientsList } from "@/app/admin/(dashboard)/clientes/clients-list";
import { ClientForm } from "@/app/admin/(dashboard)/clientes/client-form";
import { getClients } from "@/lib/data/clients";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export const metadata: Metadata = {
  title: "Clientes · Admin",
  robots: { index: false, follow: false },
};

export default async function AdminClientesPage() {
  const { clients, usingFallback } = await getClients();
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <div>
      {usingFallback && <FallbackBanner />}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Logos exibidas na vitrine “Pra quem já escrevi”, na Home.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(0,360px)]">
        <div>
          {clients.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border px-8 py-16 text-center">
              <p className="text-muted-foreground">Nenhum cliente cadastrado ainda.</p>
            </div>
          ) : (
            <ClientsList clients={clients} readOnly={usingFallback} />
          )}
        </div>
        <ClientForm supabaseConfigured={supabaseConfigured} />
      </div>
    </div>
  );
}
