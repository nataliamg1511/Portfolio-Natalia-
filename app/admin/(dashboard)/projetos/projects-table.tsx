"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatMeta } from "@/lib/format";
import type { Project } from "@/lib/types";
import { deleteProjectAction, moveProjectAction, toggleStatusAction } from "@/app/admin/(dashboard)/projetos/actions";

export function ProjectsTable({ projects, readOnly }: { projects: Project[]; readOnly: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  function handleToggle(project: Project) {
    if (readOnly) return;
    startTransition(async () => {
      const nextStatus = project.status === "published" ? "draft" : "published";
      const result = await toggleStatusAction(project.id, nextStatus);
      if (!result.ok) toast.error(result.error ?? "Não foi possível atualizar o status.");
      else toast.success(nextStatus === "published" ? "Projeto publicado." : "Projeto despublicado.");
    });
  }

  function handleMove(project: Project, direction: "up" | "down") {
    if (readOnly) return;
    startTransition(async () => {
      const result = await moveProjectAction(project.id, direction);
      if (!result.ok) toast.error(result.error ?? "Não foi possível reordenar.");
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteProjectAction(deleteTarget.id);
      if (!result.ok) toast.error(result.error ?? "Não foi possível excluir.");
      else toast.success("Projeto excluído.");
      setDeleteTarget(null);
    });
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Capa</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoria · Ano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="relative size-12 overflow-hidden rounded bg-secondary">
                    <Image src={project.cover_image_url} alt="" fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/projetos/${project.id}`} className="font-medium text-foreground hover:underline">
                    {project.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatMeta([project.category, project.year])}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={project.status === "published"}
                      onCheckedChange={() => handleToggle(project)}
                      disabled={isPending || readOnly}
                      aria-label="Publicado"
                    />
                    <Badge variant={project.status === "published" ? "default" : "secondary"}>
                      {project.status === "published" ? "Publicado" : "Rascunho"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending || readOnly || index === 0}
                      onClick={() => handleMove(project, "up")}
                      aria-label="Mover para cima"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending || readOnly || index === projects.length - 1}
                      onClick={() => handleMove(project, "down")}
                      aria-label="Mover para baixo"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Mais ações">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/projetos/${project.id}`}>Editar</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          disabled={readOnly}
                          onSelect={() => setDeleteTarget(project)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir “{deleteTarget?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. O projeto sai do site imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
