"use server";

import { contactSchema } from "@/lib/validation/contact";
import { sendMessage } from "@/lib/data/messages";

export interface ContactActionState {
  ok: boolean;
  error?: string;
}

export async function submitContactForm(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Confira os campos destacados e tente de novo." };
  }

  const result = await sendMessage(parsed.data);

  if (!result.ok) {
    return { ok: false, error: "Não conseguimos enviar sua mensagem agora. Tenta de novo em instantes." };
  }

  return { ok: true };
}
