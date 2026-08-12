"use server";

import { revalidatePath } from "next/cache";
import { clientSchema } from "@/lib/validation/client";
import { createClientEntry } from "@/lib/data/clients";

export interface ClientFormState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createClientFormAction(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    logo_url: String(formData.get("logo_url") ?? ""),
    logo_alt: String(formData.get("logo_alt") ?? ""),
  };

  const parsed = clientSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Confira os campos destacados.", fieldErrors };
  }

  const result = await createClientEntry(parsed.data);
  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath("/admin/clientes");
  revalidatePath("/");

  return { ok: true };
}
