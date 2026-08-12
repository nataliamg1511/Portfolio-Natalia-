import type { Metadata } from "next";
import Link from "next/link";
import { ProjectForm } from "@/app/admin/(dashboard)/projetos/project-form";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export const metadata: Metadata = {
  title: "Novo projeto · Admin",
  robots: { index: false, follow: false },
};

export default function NovoProjetoPage() {
  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">
        <Link href="/admin/projetos" className="hover:text-foreground">
          Projetos
        </Link>{" "}
        / Novo projeto
      </p>
      <h1 className="mb-8 text-2xl font-semibold text-foreground">Novo projeto</h1>
      <ProjectForm project={null} supabaseConfigured={isSupabaseConfigured()} />
    </div>
  );
}
