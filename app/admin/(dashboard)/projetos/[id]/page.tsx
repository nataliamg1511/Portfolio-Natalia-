import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/app/admin/(dashboard)/projetos/project-form";
import { getProjectByIdAdmin } from "@/lib/data/projects";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export const metadata: Metadata = {
  title: "Editar projeto · Admin",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProjetoPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectByIdAdmin(id);

  if (!project) notFound();

  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">
        <Link href="/admin/projetos" className="hover:text-foreground">
          Projetos
        </Link>{" "}
        / {project.title}
      </p>
      <h1 className="mb-8 text-2xl font-semibold text-foreground">Editar projeto</h1>
      <ProjectForm project={project} supabaseConfigured={isSupabaseConfigured()} />
    </div>
  );
}
