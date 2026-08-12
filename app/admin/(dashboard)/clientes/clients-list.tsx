"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import type { Client } from "@/lib/types";
import { deleteClientAction, moveClientAction } from "@/app/admin/(dashboard)/clientes/actions";

export function ClientsList({ clients, readOnly }: { clients: Client[]; readOnly: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  function handleMove(client: Client, direction: "up" | "down") {
    if (readOnly) return;
    startTransition(async () => {
      const result = await moveClientAction(client.id, direction);
      if (!result.ok) toast.error(result.error ?? "Não foi possível reordenar.");
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteClientAction(deleteTarget.id);
      if (!result.ok) toast.error(result.error ?? "Não foi possível excluir.");
      else toast.success("Cliente excluído.");
      setDeleteTarget(null);
    });
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Logo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client, index) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="relative flex size-12 items-center justify-center overflow-hidden rounded bg-secondary p-1.5">
                    <Image src={client.logo_url} alt="" fill className="object-contain p-1.5" />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-foreground">{client.name}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending || readOnly || index === 0}
                      onClick={() => handleMove(client, "up")}
                      aria-label="Mover para cima"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending || readOnly || index === clients.length - 1}
                      onClick={() => handleMove(client, "down")}
                      aria-label="Mover para baixo"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending || readOnly}
                      onClick={() => setDeleteTarget(client)}
                      aria-label="Excluir"
                    >
                      <Trash2 className="size-4" />
                    </Button>
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
            <AlertDialogTitle>Excluir “{deleteTarget?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. A logo sai da vitrine do site imediatamente.
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
