"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { AlertCircle, ImagePlus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { slugify } from "@/lib/slug";
import { uploadProjectImage } from "@/lib/supabase/upload";
import { saveProjectAction, type ProjectFormState } from "@/app/admin/(dashboard)/projetos/form-actions";
import type { Project } from "@/lib/types";

interface ProjectFormProps {
  project: Project | null;
  supabaseConfigured: boolean;
}

interface GalleryItem {
  image_url: string;
  alt_text: string;
}

const initialState: ProjectFormState = { ok: false };

export function ProjectForm({ project, supabaseConfigured }: ProjectFormProps) {
  const router = useRouter();
  const boundAction = saveProjectAction.bind(null, project?.id ?? null);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!project);
  const [status, setStatus] = useState<"draft" | "published">(project?.status ?? "draft");
  const [coverUrl, setCoverUrl] = useState(project?.cover_image_url ?? "");
  const [hoverUrl, setHoverUrl] = useState(project?.hover_image_url ?? "");
  const [gallery, setGallery] = useState<GalleryItem[]>(
    project?.gallery?.map((g) => ({ image_url: g.image_url, alt_text: g.alt_text })) ?? []
  );
  const [uploading, setUploading] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const hoverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok && state.projectId) {
      toast.success("Projeto salvo.");
      router.push("/admin/projetos");
    }
  }, [state.ok, state.projectId, router]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleCoverUpload(file: File) {
    setUploading("cover");
    const url = await uploadProjectImage(file, "covers");
    setUploading(null);
    if (url) setCoverUrl(url);
    else toast.error("Não foi possível enviar a imagem. Conecte o Supabase (ver CLAUDE.md).");
  }

  async function handleHoverUpload(file: File) {
    setUploading("hover");
    const url = await uploadProjectImage(file, "covers");
    setUploading(null);
    if (url) setHoverUrl(url);
    else toast.error("Não foi possível enviar a imagem. Conecte o Supabase (ver CLAUDE.md).");
  }

  async function handleGalleryUpload(file: File) {
    setUploading("gallery");
    const url = await uploadProjectImage(file, "gallery");
    setUploading(null);
    if (url) setGallery((g) => [...g, { image_url: url, alt_text: "" }]);
    else toast.error("Não foi possível enviar a imagem. Conecte o Supabase (ver CLAUDE.md).");
  }

  function moveGalleryItem(index: number, direction: "up" | "down") {
    setGallery((items) => {
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= items.length) return items;
      const next = [...items];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <form action={formAction} className="max-w-3xl space-y-12">
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
            Conecte o Supabase para salvar de verdade e enviar imagens (ver CLAUDE.md). Este
            formulário funciona só como pré-visualização enquanto isso.
          </AlertDescription>
        </Alert>
      )}

      {/* Publicação — fixo no topo para a usuária sempre saber o estado atual */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-background px-6 py-4">
        <div>
          <p className="text-sm font-medium text-foreground">Publicação</p>
          <p className="text-xs text-muted-foreground">
            {status === "published" ? "Visível no site agora." : "Só você vê este projeto."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rascunho</span>
          <Switch
            checked={status === "published"}
            onCheckedChange={(checked) => setStatus(checked ? "published" : "draft")}
          />
          <span className="text-sm text-muted-foreground">Publicado</span>
        </div>
        <input type="hidden" name="status" value={status} />
      </div>

      {/* Informações básicas */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold text-foreground">Informações básicas</h2>

        <div className="space-y-2">
          <Label htmlFor="title">Título*</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
          {state.fieldErrors?.title && <FieldError message={state.fieldErrors.title} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Endereço da página</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            required
          />
          <p className="text-xs text-muted-foreground">nataliamachado.com.br/projetos/{slug || "endereco-do-projeto"}</p>
          {state.fieldErrors?.slug && <FieldError message={state.fieldErrors.slug} />}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria*</Label>
            <Input id="category" name="category" defaultValue={project?.category ?? ""} required />
            {state.fieldErrors?.category && <FieldError message={state.fieldErrors.category} />}
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Ano*</Label>
            <Input id="year" name="year" type="number" defaultValue={project?.year ?? new Date().getFullYear()} required />
            {state.fieldErrors?.year && <FieldError message={state.fieldErrors.year} />}
          </div>
          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            <Input id="client" name="client" defaultValue={project?.client ?? ""} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="award">Prêmio (opcional)</Label>
          <Input id="award" name="award" placeholder="Ex.: Top of Marketing ADVB/PR" defaultValue={project?.award ?? ""} />
        </div>
      </section>

      <Separator />

      {/* Imagens do card */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold text-foreground">Imagens do card</h2>
        <p className="text-sm text-muted-foreground">
          A imagem de hover aparece quando alguém passa o mouse sobre o card no site.
        </p>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="space-y-3">
            <Label>Imagem de capa*</Label>
            <ImagePreview src={coverUrl} loading={uploading === "cover"} />
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => coverInputRef.current?.click()}>
              <ImagePlus className="size-4" /> Enviar imagem
            </Button>
            <input type="hidden" name="cover_image_url" value={coverUrl} />
            {state.fieldErrors?.cover_image_url && <FieldError message={state.fieldErrors.cover_image_url} />}
            <div className="space-y-2">
              <Label htmlFor="cover_image_alt">Texto alternativo*</Label>
              <Input id="cover_image_alt" name="cover_image_alt" defaultValue={project?.cover_image_alt ?? ""} required />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Imagem de hover</Label>
            <ImagePreview src={hoverUrl} loading={uploading === "hover"} />
            <input
              ref={hoverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleHoverUpload(e.target.files[0])}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => hoverInputRef.current?.click()}>
              <ImagePlus className="size-4" /> Enviar imagem
            </Button>
            <input type="hidden" name="hover_image_url" value={hoverUrl} />
            <div className="space-y-2">
              <Label htmlFor="hover_image_alt">Texto alternativo</Label>
              <Input id="hover_image_alt" name="hover_image_alt" defaultValue={project?.hover_image_alt ?? ""} />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Conteúdo do case */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold text-foreground">Conteúdo do case</h2>
        <p className="text-sm text-muted-foreground">
          Preencha os quatro campos — é isso que mostra pra quem avalia o portfólio que existe
          estratégia por trás da peça.
        </p>

        <div className="space-y-2">
          <Label htmlFor="context_text">Contexto do cliente*</Label>
          <Textarea id="context_text" name="context_text" rows={3} defaultValue={project?.context_text ?? ""} required />
          {state.fieldErrors?.context_text && <FieldError message={state.fieldErrors.context_text} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="challenge_text">O desafio*</Label>
          <Textarea id="challenge_text" name="challenge_text" rows={3} defaultValue={project?.challenge_text ?? ""} required />
          {state.fieldErrors?.challenge_text && <FieldError message={state.fieldErrors.challenge_text} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="solution_text">A solução criativa*</Label>
          <Textarea id="solution_text" name="solution_text" rows={3} defaultValue={project?.solution_text ?? ""} required />
          {state.fieldErrors?.solution_text && <FieldError message={state.fieldErrors.solution_text} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="result_text">O resultado*</Label>
          <Textarea id="result_text" name="result_text" rows={3} defaultValue={project?.result_text ?? ""} required />
          {state.fieldErrors?.result_text && <FieldError message={state.fieldErrors.result_text} />}
        </div>
      </section>

      <Separator />

      {/* Galeria */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold text-foreground">Galeria</h2>
        <p className="text-sm text-muted-foreground">
          Imagens grandes que aparecem na página do case, na ordem abaixo.
        </p>

        <div className="space-y-4">
          {gallery.map((item, index) => (
            <div key={index} className="flex items-start gap-4 rounded-lg border border-border p-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded bg-secondary">
                {item.image_url && <Image src={item.image_url} alt="" fill className="object-cover" />}
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-xs">Texto alternativo</Label>
                <Input
                  value={item.alt_text}
                  onChange={(e) =>
                    setGallery((items) =>
                      items.map((it, i) => (i === index ? { ...it, alt_text: e.target.value } : it))
                    )
                  }
                  placeholder="Descreva a imagem"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => moveGalleryItem(index, "up")} disabled={index === 0}>
                  ↑
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => moveGalleryItem(index, "down")} disabled={index === gallery.length - 1}>
                  ↓
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setGallery((items) => items.filter((_, i) => i !== index))}
                aria-label="Remover imagem"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleGalleryUpload(e.target.files[0])}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => galleryInputRef.current?.click()} disabled={uploading === "gallery"}>
          <ImagePlus className="size-4" /> Adicionar imagem à galeria
        </Button>
        <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
      </section>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando…" : "Salvar"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/projetos")}>
          Cancelar
        </Button>
      </div>
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

function ImagePreview({ src, loading }: { src: string; loading: boolean }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded border border-border bg-secondary">
      {src && <Image src={src} alt="" fill className="object-cover" />}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm text-muted-foreground">
          Enviando…
        </div>
      )}
      {!src && !loading && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          Nenhuma imagem
        </div>
      )}
    </div>
  );
}
