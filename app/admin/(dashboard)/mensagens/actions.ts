"use server";

import { revalidatePath } from "next/cache";
import { markMessageAsRead } from "@/lib/data/messages";

export async function markMessageAsReadAction(id: string) {
  const result = await markMessageAsRead(id);
  revalidatePath("/admin/mensagens");
  return result;
}
