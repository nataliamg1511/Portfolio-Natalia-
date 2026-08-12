"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/admin/projetos");

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Conecte o Supabase para ativar o login (ver CLAUDE.md)." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  redirect(redirectTo || "/admin/projetos");
}

export async function logoutAction() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath("/admin");
  redirect("/admin");
}

export interface ResetPasswordState {
  ok?: boolean;
  error?: string;
}

export async function requestPasswordResetAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const email = String(formData.get("email") ?? "");
  if (!email) return { error: "Informe seu e-mail." };

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Conecte o Supabase para usar a recuperação de senha." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { error: "Não foi possível enviar o e-mail de recuperação." };
  return { ok: true };
}
