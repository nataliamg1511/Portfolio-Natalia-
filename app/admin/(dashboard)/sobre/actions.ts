"use server";

import { revalidatePath } from "next/cache";
import { aboutSchema } from "@/lib/validation/about";
import { getAbout, updateAbout } from "@/lib/data/about";

export interface AboutFormState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function saveAboutAction(
  _prevState: AboutFormState,
  formData: FormData
): Promise<AboutFormState> {
  const raw = {
    photo_url: String(formData.get("photo_url") ?? ""),
    photo_alt: String(formData.get("photo_alt") ?? ""),
    photo_position: String(formData.get("photo_position") ?? ""),
    bio_main_text: String(formData.get("bio_main_text") ?? ""),
    bio_secondary_text: String(formData.get("bio_secondary_text") ?? ""),
    resume_url: String(formData.get("resume_url") ?? ""),
    linkedin_url: String(formData.get("linkedin_url") ?? ""),
    email: String(formData.get("email") ?? ""),
    whatsapp_number: String(formData.get("whatsapp_number") ?? ""),
  };

  // O campo de tags "clients" saiu do formulário (a vitrine de logos é
  // gerenciada em /admin/clientes) — preservamos o valor já salvo no banco.
  const clientsRaw = formData.get("clients");
  const tools = String(formData.get("tools") ?? "[]");

  const parsed = aboutSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Confira os campos destacados.", fieldErrors };
  }

  const { about } = await getAbout();

  const result = await updateAbout(about.id, {
    ...parsed.data,
    clients: clientsRaw === null ? about.clients : JSON.parse(String(clientsRaw)),
    tools: JSON.parse(tools),
  });

  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath("/admin/sobre");
  revalidatePath("/sobre");
  revalidatePath("/contato");

  return { ok: true };
}
