import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function FallbackBanner() {
  return (
    <Alert variant="destructive" className="mb-8">
      <AlertCircle className="size-4" />
      <AlertTitle>Supabase não conectado</AlertTitle>
      <AlertDescription>
        Você está vendo dados de exemplo. Conecte o Supabase para ativar o painel de verdade
        (criar, editar e publicar projetos). Veja o passo a passo em CLAUDE.md.
      </AlertDescription>
    </Alert>
  );
}
