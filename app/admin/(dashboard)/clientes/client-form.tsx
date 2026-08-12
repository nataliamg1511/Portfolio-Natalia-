"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { AlertCircle, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadProjectImage } from "@/lib/supabase/upload";
import { createClientFormAction, type ClientFormState } from "@/app/admin/(dashboard)/clientes/form-actions";

const initialState: ClientFormState = { ok: false };

/** "Grupo X" pede artigo masculino; demais nomes usam o feminino genérico — mesma regra de lib/data/seed.ts. */
function altTextFor(name: string) {
  return `Logo d${name.trim().startsWith("Grupo") ? "o" : "a"} ${name.trim()}`;
}

export function ClientForm({ supabaseConfigured }: { supabaseConfigured: boolean }) {
  const [state, formAction, isPending] = useActionState(createClientFormAction, initialState);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success("Cliente adicionado.");
      setName("");
      setLogoUrl("");
      formRef.current?.reset();
    }
  }, [state.ok]);

  async function handleUpload(file: File) {
    setUploading(true);
    const url = await uploadProjectImage(file, "clients");
    setUploading(false);
    if (url) setLogoUrl(url);
    else toast.error("Não foi possível enviar a logo. Conecte o Supabase (ver CLAUDE.md).");
  }

  return (
    <form ref={formRef} action={formAction} className="max-w-md space-y-6 rounded-lg border border-border bg-background p-6">
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nome do cliente*</Label>
        <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
        {state.fieldErrors?.name && <FieldError message={state.fieldErrors.name} />}
      </div>

      <div className="space-y-3">
        <Label>Logo*</Label>
        <div className="flex h-20 w-32 items-center justify-center rounded border border-border bg-secondary p-3">
          {logoUrl && (
            <div className="relative h-full w-full">
              <Image src={logoUrl} alt="" fill className="object-contain" />
            </div>
          )}
          {uploading && <p className="text-xs text-muted-foreground">Enviando…</p>}
          {!logoUrl && !uploading && <p className="text-xs text-muted-foreground">Nenhuma logo</p>}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <ImagePlus className="size-4" /> Enviar logo
        </Button>
        <input type="hidden" name="logo_url" value={logoUrl} />
        <input type="hidden" name="logo_alt" value={name ? altTextFor(name) : ""} />
        {state.fieldErrors?.logo_url && <FieldError message={state.fieldErrors.logo_url} />}
      </div>

      {!supabaseConfigured && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            Conecte o Supabase para salvar de verdade e enviar logos (ver CLAUDE.md).
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isPending || uploading}>
        {isPending ? "Adicionando…" : "+ Adicionar cliente"}
      </Button>
    </form>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-destructive">
      <AlertCircle className="size-3.5" aria-hidden /> {message}
    </p>
  );
}
