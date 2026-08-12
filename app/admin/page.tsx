import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/app/admin/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-6">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Natália Machado · Admin
        </p>

        {!configured && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="size-4" />
            <AlertTitle>Supabase não conectado</AlertTitle>
            <AlertDescription>
              Conecte o Supabase para ativar o painel administrativo. Veja o passo a passo em
              CLAUDE.md.
            </AlertDescription>
          </Alert>
        )}

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
