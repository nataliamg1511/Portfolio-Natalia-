import { z } from "zod";

const positionRegex = /^-?\d+(?:\.\d+)?%\s+-?\d+(?:\.\d+)?%$/;

/**
 * "X% Y%" (CSS `object-position`) — o form sempre manda uma string (nunca
 * `undefined`, ver form-actions.ts), então só precisamos validar o formato
 * e cair pro centro em qualquer valor vazio/inesperado.
 */
const positionSchema = z
  .string()
  .trim()
  .transform((v) => (positionRegex.test(v) ? v : "50% 50%"));

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Escreva o título do projeto."),
  slug: z
    .string()
    .trim()
    .min(2, "Defina o endereço da página.")
    .regex(/^[a-z0-9-]+$/, "Use só letras minúsculas, números e hífen."),
  category: z.string().trim().min(2, "Escolha a categoria."),
  year: z.coerce.number().int().min(2000).max(2100),
  client: z.string().trim().optional().default(""),
  award: z.string().trim().optional().default(""),
  cover_image_url: z.string().trim().min(1, "Envie ou informe a imagem de capa."),
  cover_image_alt: z.string().trim().min(1, "Descreva a imagem de capa (texto alternativo)."),
  cover_image_position: positionSchema,
  hover_image_url: z.string().trim().optional().default(""),
  hover_image_alt: z.string().trim().optional().default(""),
  hover_image_position: positionSchema,
  status: z.enum(["draft", "published"]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

const urlOk = (url: string) => /^https?:\/\//.test(url) || url.startsWith("/");

/** Item de carrossel: imagem ou vídeo lado a lado. */
export const carouselItemSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().trim().min(1, "Item do carrossel sem mídia."),
  alt: z.string().trim().optional().default(""),
  aspect: z.enum(["16:9", "9:16", ""]).optional().default(""),
});

/**
 * Bloco de conteúdo do case — todos opcionais e com título editável.
 * Texto precisa de corpo; vídeo, link e imagem precisam de URL; carrossel
 * precisa de pelo menos um item. `layout` cai no padrão por tipo: texto na
 * coluna de leitura, mídia larga.
 */
export const projectSectionSchema = z
  .object({
    kind: z.enum(["text", "video", "link", "image", "carousel"]),
    title: z.string().trim().optional().default(""),
    body: z.string().trim().optional().default(""),
    url: z.string().trim().optional().default(""),
    image_alt: z.string().trim().optional().default(""),
    layout: z.enum(["small", "contained", "wide", "half", "full"]).optional(),
    align: z.enum(["left", "center", "right"]).optional().default("center"),
    position: positionSchema.optional().default("50% 50%"),
    aspect: z.enum(["16:9", "9:16", ""]).optional().default(""),
    items: z.array(carouselItemSchema).optional().default([]),
  })
  .superRefine((section, ctx) => {
    if (section.kind === "text" && !section.body && !section.title) {
      ctx.addIssue({ code: "custom", message: "Escreva o texto da seção (ou remova a seção)." });
    }
    if ((section.kind === "video" || section.kind === "link") && !section.url) {
      ctx.addIssue({ code: "custom", message: "Informe a URL." });
    }
    if (section.kind === "image" && !section.url) {
      ctx.addIssue({ code: "custom", message: "Envie a imagem do bloco (ou remova o bloco)." });
    }
    if (section.kind === "carousel" && section.items.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Adicione pelo menos uma imagem ou vídeo ao carrossel (ou remova o bloco).",
      });
    }
    if (section.url && !urlOk(section.url)) {
      ctx.addIssue({ code: "custom", message: "A URL precisa começar com http:// ou https://." });
    }
    if (section.items.some((item) => !urlOk(item.url))) {
      ctx.addIssue({
        code: "custom",
        message: "Todo item do carrossel precisa de uma URL começando com http:// ou https://.",
      });
    }
  })
  .transform((section) => ({
    ...section,
    layout: section.layout ?? (section.kind === "text" ? ("contained" as const) : ("wide" as const)),
  }));

export const projectSectionsSchema = z.array(projectSectionSchema);

export const galleryImageSchema = z.object({
  image_url: z.string().trim().min(1),
  alt_text: z.string().trim().min(1, "Descreva a imagem (texto alternativo)."),
  position: positionSchema,
});
