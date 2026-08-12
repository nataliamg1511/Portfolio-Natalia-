"use server";

import { revalidatePath } from "next/cache";
import { deleteClientEntry, getClients, swapClientOrder } from "@/lib/data/clients";

export async function deleteClientAction(id: string) {
  const result = await deleteClientEntry(id);
  revalidatePath("/admin/clientes");
  revalidatePath("/");
  return result;
}

export async function moveClientAction(id: string, direction: "up" | "down") {
  const { clients } = await getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) return { ok: false as const, error: "Cliente não encontrado." };

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= clients.length) {
    return { ok: true as const };
  }

  const current = clients[index];
  const target = clients[targetIndex];

  const result = await swapClientOrder(
    current.id,
    current.display_order,
    target.id,
    target.display_order
  );

  revalidatePath("/admin/clientes");
  revalidatePath("/");
  return result;
}
