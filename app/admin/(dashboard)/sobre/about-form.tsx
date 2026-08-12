"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { AlertCircle, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EditableList } from "@/components/admin/editable-list";
import { uploadProjectImage } from "@/lib/supabase/upload";
import { saveAboutAction, type AboutFormState } from "@/app/admin/(dashboard)/sobre/actions";
import type { About } from "@/lib/types";

const initialState: AboutFormState = { ok: false };

export function AboutForm({ about, supabaseConfigured }: { about: About; supabaseConfigured: boolean }) {
  const [state, formAction, isPending] = useActionState(saveAboutAction, initialState);
  const [photoUrl, setPhotoUrl] = useState(about.photo_url);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) toast.success("Alterações salvas.");
  }, [state.ok]);

  async function handlePhotoUpload(file: File) {
    setUploading(true);
    const url = await uploadProjectImage(file, "about");
    setUploading(false);
    if (url) setPhotoUrl(url);
    else toast.error("Não foi possível enviar a foto. Conecte o Supabase (ver CLAUDE.md).");
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-10">
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {!supabaseConfigured && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            Conecte o Supabase para salvar de verdade e enviar imagens (ver CLAUDE.md).
          </AlertDescription>
        </Alert>
      )}

      <section className="space-y-3">
        <Label>Foto</Label>
        <div className="relative aspect-[4/5] w-48 overflow-hidden rounded border border-border bg-secondary">
          {photoUrl && <Image src={photoUrl} alt="" fill className="object-cover" />}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-xs text-muted-foreground">
              Enviando…
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <ImagePlus className="size-4" /> Enviar foto
        </Button>
        <input type="hidden" name="photo_url" value={photoUrl} />
        <div className="space-y-2">
          <Label htmlFor="photo_alt">Texto alternativo da foto*</Label>
          <Input id="photo_alt" name="photo_alt" defaultValue={about.photo_alt} required />
          {state.fieldErrors?.photo_alt && <FieldError message={state.fieldErrors.photo_alt} />}
        </div>
      </section>

      <Separator />

      <section className="space-y-2">
        <Label htmlFor="bio_main_text">Quem é a Nat?*</Label>
        <Textarea id="bio_main_text" name="bio_main_text" rows={8} defaultValue={about.bio_main_text} required />
        <p className="text-xs text-muted-foreground">Separe parágrafos com uma linha em branco.</p>
        {state.fieldErrors?.bio_main_text && <FieldError message={state.fieldErrors.bio_main_text} />}
      </section>

      <section className="space-y-2">
        <Label htmlFor="bio_secondary_text">Um relacionamento*</Label>
        <Textarea id="bio_secondary_text" name="bio_secondary_text" rows={8} defaultValue={about.bio_secondary_text} required />
        {state.fieldErrors?.bio_secondary_text && <FieldError message={state.fieldErrors.bio_secondary_text} />}
      </section>

      <Separator />

      <EditableList name="clients" label="Clientes/marcas atendidas" initialItems={about.clients} placeholder="Nome do cliente" />
      <EditableList name="tools" label="Ferramentas/IAs" initialItems={about.tools} placeholder="Nome da ferramenta" />

      <Separator />

      <section className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="resume_url">Link do currículo (Google Drive)</Label>
          <Input id="resume_url" name="resume_url" defaultValue={about.resume_url} placeholder="https://drive.google.com/..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin_url">LinkedIn</Label>
          <Input id="linkedin_url" name="linkedin_url" defaultValue={about.linkedin_url} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail de contato*</Label>
          <Input id="email" name="email" type="email" defaultValue={about.email} required />
          {state.fieldErrors?.email && <FieldError message={state.fieldErrors.email} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp_number">WhatsApp (com DDI e DDD, só números)*</Label>
          <Input id="whatsapp_number" name="whatsapp_number" defaultValue={about.whatsapp_number} placeholder="5541985324358" required />
          {state.fieldErrors?.whatsapp_number && <FieldError message={state.fieldErrors.whatsapp_number} />}
        </div>
      </section>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando…" : "Salvar alterações"}
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
