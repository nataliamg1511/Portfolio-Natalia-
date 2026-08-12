import type { Metadata } from "next";
import { AboutForm } from "@/app/admin/(dashboard)/sobre/about-form";
import { FallbackBanner } from "@/components/admin/fallback-banner";
import { getAbout } from "@/lib/data/about";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export const metadata: Metadata = {
  title: "Sobre · Admin",
  robots: { index: false, follow: false },
};

export default async function AdminSobrePage() {
  const { about, usingFallback } = await getAbout();

  return (
    <div>
      {usingFallback && <FallbackBanner />}
      <h1 className="mb-8 text-2xl font-semibold text-foreground">Editar Sobre</h1>
      <AboutForm about={about} supabaseConfigured={isSupabaseConfigured()} />
    </div>
  );
}
