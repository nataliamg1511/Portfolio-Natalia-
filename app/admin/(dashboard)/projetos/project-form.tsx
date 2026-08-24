"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  AlertCircle,
  GripVertical,
  ImagePlus,
  Link2,
  Plus,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePositionPicker } from "@/components/admin/image-position-picker";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/slug";
import { isVideoFileUrl } from "@/lib/video";
import { uploadProjectImage, uploadProjectVideo, MAX_VIDEO_SIZE_MB } from "@/lib/supabase/upload";
import { saveProjectAction, type ProjectFormState } from "@/app/admin/(dashboard)/projetos/form-actions";
import type { Project, SectionAlign, SectionLayout } from "@/lib/types";

interface ProjectFormProps {
  project: Project | null;
  supabaseConfigured: boolean;
}

interface SectionItem {
  /** Id local (só pro drag-and-drop) — o servidor recria as linhas ao salvar. */
  id: string;
  kind: "text" | "video" | "link" | "image";
  title: string;
  body: string;
  url: string;
  image_alt: string;
  layout: SectionLayout;
  align: SectionAlign;
  position: string;
}

const DEFAULT_SECTION_TITLES = ["Contexto do cliente", "O desafio", "A solução criativa", "O resultado"];

const KIND_LABEL: Record<SectionItem["kind"], string> = {
  text: "Texto",
  video: "Vídeo",
  link: "Link",
  image: "Imagem",
};

let uidCounter = 0;
function uid() {
  uidCounter += 1;
  return `local-${uidCounter}`;
}

function newSection(kind: SectionItem["kind"], overrides: Partial<SectionItem> = {}): SectionItem {
  return {
    id: uid(),
    kind,
    title: "",
    body: "",
    url: "",
    image_alt: "",
    layout: kind === "text" ? "contained" : "wide",
    align: "center",
    position: "50% 50%",
    ...overrides,
  };
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
  const [coverPosition, setCoverPosition] = useState(project?.cover_image_position ?? "50% 50%");
  const [hoverUrl, setHoverUrl] = useState(project?.hover_image_url ?? "");
  const [hoverPosition, setHoverPosition] = useState(project?.hover_image_position ?? "50% 50%");
  const [sections, setSections] = useState<SectionItem[]>(
    project?.sections?.map((s) =>
      newSection(s.kind, {
        title: s.title,
        body: s.body,
        url: s.url,
        image_alt: s.image_alt,
        layout: s.layout,
        align: s.align,
        position: s.position,
      })
    ) ?? DEFAULT_SECTION_TITLES.map((title) => newSection("text", { title }))
  );
  const [uploading, setUploading] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const hoverInputRef = useRef<HTMLInputElement>(null);
  const imageBlockInputRef = useRef<HTMLInputElement>(null);

  // distance: 6 deixa cliques normais na alça passarem sem virar drag;
  // KeyboardSensor mantém o reordenamento acessível (Espaço + setas).
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  async function handleImageBlockUpload(file: File) {
    setUploading("image-block");
    const url = await uploadProjectImage(file, "gallery");
    setUploading(null);
    if (url) setSections((items) => [...items, newSection("image", { url })]);
    else toast.error("Não foi possível enviar a imagem. Conecte o Supabase (ver CLAUDE.md).");
  }

  async function handleVideoUpload(sectionId: string, file: File) {
    setUploading(sectionId);
    const result = await uploadProjectVideo(file);
    setUploading(null);
    if ("url" in result) {
      updateSectionById(sectionId, { url: result.url });
      toast.success("Vídeo enviado.");
    } else {
      toast.error(result.error);
    }
  }

  function moveSection(index: number, direction: "up" | "down") {
    setSections((items) => {
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= items.length) return items;
      return arrayMove(items, index, target);
    });
  }

  function updateSectionById(id: string, patch: Partial<SectionItem>) {
    setSections((items) => items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections((items) => {
      const from = items.findIndex((it) => it.id === active.id);
      const to = items.findIndex((it) => it.id === over.id);
      if (from < 0 || to < 0) return items;
      return arrayMove(items, from, to);
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
            {coverUrl && (
              <div className="space-y-2">
                <Label>Enquadramento no card (4:3)</Label>
                <ImagePositionPicker
                  imageUrl={coverUrl}
                  aspectRatio={4 / 3}
                  value={coverPosition}
                  onChange={setCoverPosition}
                />
              </div>
            )}
            <input type="hidden" name="cover_image_position" value={coverPosition} />
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
            {hoverUrl && (
              <div className="space-y-2">
                <Label>Enquadramento no card (4:3)</Label>
                <ImagePositionPicker
                  imageUrl={hoverUrl}
                  aspectRatio={4 / 3}
                  value={hoverPosition}
                  onChange={setHoverPosition}
                />
              </div>
            )}
            <input type="hidden" name="hover_image_position" value={hoverPosition} />
          </div>
        </div>
      </section>

      <Separator />

      {/* Conteúdo do case — blocos arrastáveis */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold text-foreground">Conteúdo do case</h2>
        <p className="text-sm text-muted-foreground">
          Monte o case com blocos de texto, imagem, vídeo e link, na ordem que quiser — arraste
          pela alça pra reordenar. Cada bloco tem controle de largura e alinhamento na página.
        </p>

        {/* id fixo: sem ele o DndContext gera ids diferentes no SSR e no
            cliente e o React acusa hydration mismatch. */}
        <DndContext id="case-blocks" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {sections.map((section, index) => (
                <SortableSectionCard
                  key={section.id}
                  section={section}
                  index={index}
                  total={sections.length}
                  uploading={uploading === section.id}
                  onMove={moveSection}
                  onRemove={(id) => setSections((items) => items.filter((it) => it.id !== id))}
                  onUpdate={updateSectionById}
                  onVideoUpload={handleVideoUpload}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <input
          ref={imageBlockInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleImageBlockUpload(e.target.files[0])}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setSections((items) => [...items, newSection("text")])}>
            <Plus className="size-4" /> Texto
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => imageBlockInputRef.current?.click()}
            disabled={uploading === "image-block"}
          >
            <ImagePlus className="size-4" /> {uploading === "image-block" ? "Enviando…" : "Imagem"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setSections((items) => [...items, newSection("video")])}>
            <Video className="size-4" /> Vídeo
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setSections((items) => [...items, newSection("link")])}>
            <Link2 className="size-4" /> Link
          </Button>
        </div>
        <input type="hidden" name="sections" value={JSON.stringify(sections)} />
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

interface SortableSectionCardProps {
  section: SectionItem;
  index: number;
  total: number;
  uploading: boolean;
  onMove: (index: number, direction: "up" | "down") => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<SectionItem>) => void;
  onVideoUpload: (id: string, file: File) => void;
}

function SortableSectionCard({
  section,
  index,
  total,
  uploading,
  onMove,
  onRemove,
  onUpdate,
  onVideoUpload,
}: SortableSectionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  // Modo do bloco de vídeo: URL de arquivo já enviado abre na aba "Arquivo".
  const [videoMode, setVideoMode] = useState<"link" | "file">(
    isVideoFileUrl(section.url) ? "file" : "link"
  );

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "space-y-3 rounded-lg border border-border bg-background p-4",
        isDragging && "z-10 border-ring shadow-lg"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Arrastar bloco ${index + 1} (${KIND_LABEL[section.kind]})`}
            className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground active:cursor-grabbing"
          >
            <GripVertical className="size-4" />
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {section.kind === "video" && <Video className="size-3.5" aria-hidden />}
            {section.kind === "link" && <Link2 className="size-3.5" aria-hidden />}
            {section.kind === "image" && <ImagePlus className="size-3.5" aria-hidden />}
            {KIND_LABEL[section.kind]}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => onMove(index, "up")} disabled={index === 0} aria-label="Mover bloco para cima">
            ↑
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => onMove(index, "down")} disabled={index === total - 1} aria-label="Mover bloco para baixo">
            ↓
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(section.id)}
            aria-label="Remover bloco"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Largura + alinhamento na página do case */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Largura na página</Label>
          <Select
            value={section.layout}
            onValueChange={(layout) => onUpdate(section.id, { layout: layout as SectionLayout })}
          >
            <SelectTrigger size="sm" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contained">Normal (leitura)</SelectItem>
              <SelectItem value="wide">Larga</SelectItem>
              <SelectItem value="half">Metade</SelectItem>
              <SelectItem value="full">Tela cheia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Alinhamento</Label>
          <Select
            value={section.align}
            onValueChange={(align) => onUpdate(section.id, { align: align as SectionAlign })}
            disabled={section.layout === "full"}
          >
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {section.layout === "half" && (
          <p className="pb-2 text-xs text-muted-foreground">
            Dois blocos &quot;Metade&quot; seguidos ficam lado a lado.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-xs">
          {section.kind === "link"
            ? "Texto do link"
            : section.kind === "text"
              ? "Título da seção (opcional)"
              : "Legenda (opcional)"}
        </Label>
        <Input
          value={section.title}
          onChange={(e) => onUpdate(section.id, { title: e.target.value })}
          placeholder={
            section.kind === "text"
              ? "Ex.: Contexto do cliente"
              : section.kind === "link"
                ? "Ex.: Ver campanha no ar"
                : "Legenda exibida abaixo da mídia"
          }
        />
      </div>

      {section.kind === "text" && (
        <div className="space-y-2">
          <Label className="text-xs">Texto</Label>
          <RichTextEditor
            value={section.body}
            onChange={(body) => onUpdate(section.id, { body })}
            minRows={4}
          />
          <p className="text-xs text-muted-foreground">
            Use a barra acima ou atalhos: &quot;- &quot; ou &quot;* &quot; começa uma lista,
            &quot;1. &quot; lista numerada, **texto** vira negrito.
          </p>
        </div>
      )}

      {section.kind === "image" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[220px_1fr]">
          <div className="space-y-1.5">
            <Label className="text-xs">Enquadramento</Label>
            <ImagePositionPicker
              imageUrl={section.url}
              aspectRatio={4 / 3}
              value={section.position}
              onChange={(position) => onUpdate(section.id, { position })}
              compact
            />
            <p className="text-xs text-muted-foreground">
              Centralizada, a imagem aparece inteira na proporção original; arrastando, entra no
              crop 4:3 acima.
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Texto alternativo</Label>
            <Input
              value={section.image_alt}
              onChange={(e) => onUpdate(section.id, { image_alt: e.target.value })}
              placeholder="Descreva a imagem"
            />
          </div>
        </div>
      )}

      {section.kind === "video" && (
        <div className="space-y-3">
          <div className="inline-flex rounded-md border border-border p-0.5" role="tablist" aria-label="Origem do vídeo">
            <button
              type="button"
              role="tab"
              aria-selected={videoMode === "link"}
              onClick={() => setVideoMode("link")}
              className={cn(
                "rounded px-3 py-1 text-xs font-medium transition-colors",
                videoMode === "link" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Link (YouTube/Vimeo)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={videoMode === "file"}
              onClick={() => setVideoMode("file")}
              className={cn(
                "rounded px-3 py-1 text-xs font-medium transition-colors",
                videoMode === "file" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Arquivo de vídeo
            </button>
          </div>

          {videoMode === "link" ? (
            <div className="space-y-2">
              <Input
                type="url"
                value={isVideoFileUrl(section.url) ? "" : section.url}
                onChange={(e) => onUpdate(section.id, { url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=…"
              />
              <p className="text-xs text-muted-foreground">
                Cole o link do YouTube ou Vimeo — o vídeo aparece incorporado na página do case.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {isVideoFileUrl(section.url) && (
                <video src={section.url} controls preload="metadata" className="w-full max-w-md rounded border border-border bg-secondary" />
              )}
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onVideoUpload(section.id, e.target.files[0])}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => videoFileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="size-4" />
                {uploading ? "Enviando…" : isVideoFileUrl(section.url) ? "Trocar vídeo" : "Enviar vídeo"}
              </Button>
              <p className="text-xs text-muted-foreground">
                .mp4, .webm ou .mov, até {MAX_VIDEO_SIZE_MB} MB. Pra vídeos maiores, use YouTube/Vimeo.
              </p>
            </div>
          )}
        </div>
      )}

      {section.kind === "link" && (
        <div className="space-y-2">
          <Label className="text-xs">URL</Label>
          <Input
            type="url"
            value={section.url}
            onChange={(e) => onUpdate(section.id, { url: e.target.value })}
            placeholder="https://…"
          />
        </div>
      )}
    </div>
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
