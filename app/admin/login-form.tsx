"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { loginAction, requestPasswordResetAction, type LoginState, type ResetPasswordState } from "@/app/admin/actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin/projetos";
  const [mode, setMode] = useState<"login" | "reset">("login");

  const [loginState, loginFormAction, loginPending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );
  const [resetState, resetFormAction, resetPending] = useActionState<ResetPasswordState, FormData>(
    requestPasswordResetAction,
    {}
  );

  if (mode === "reset") {
    return (
      <form action={resetFormAction} className="w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Recuperar senha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Informe seu e-mail. Enviaremos um link para redefinir a senha.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reset-email">E-mail</Label>
          <Input id="reset-email" name="email" type="email" required />
        </div>
        {resetState.error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{resetState.error}</AlertDescription>
          </Alert>
        )}
        {resetState.ok && (
          <Alert>
            <CheckCircle2 className="size-4" />
            <AlertDescription>E-mail de recuperação enviado, se essa conta existir.</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={resetPending}>
          {resetPending ? "Enviando…" : "Enviar link de recuperação"}
        </Button>
        <button
          type="button"
          onClick={() => setMode("login")}
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Voltar para o login
        </button>
      </form>
    );
  }

  return (
    <form action={loginFormAction} className="w-full max-w-sm space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Entrar no painel</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acesso restrito à Natália Machado.</p>
      </div>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {loginState.error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{loginState.error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={loginPending}>
        {loginPending ? "Entrando…" : "Entrar"}
      </Button>
      <button
        type="button"
        onClick={() => setMode("reset")}
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Esqueci minha senha
      </button>
    </form>
  );
}
