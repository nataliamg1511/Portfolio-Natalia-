import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FallbackBanner } from "@/components/admin/fallback-banner";
import { ProjectsTable } from "@/app/admin/(dashboard)/projetos/projects-table";
import { getAllProjectsAdmin } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Projetos · Admin",
  robots: { index: false, follow: false },
};

export default async function AdminProjetosPage() {
  const { projects, usingFallback } = await getAllProjectsAdmin();

  return (
    <div>
      {usingFallback && <FallbackBanner />}

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Projetos</h1>
        <Button asChild>
          <Link href="/admin/projetos/novo">+ Novo projeto</Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-8 py-16 text-center">
          <p className="text-muted-foreground">Nenhum projeto cadastrado ainda.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/projetos/novo">+ Criar primeiro projeto</Link>
          </Button>
        </div>
      ) : (
        <ProjectsTable projects={projects} readOnly={usingFallback} />
      )}
    </div>
  );
}
