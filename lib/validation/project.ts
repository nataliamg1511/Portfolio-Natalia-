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

/**
 * Seção de conteúdo do case — todas opcionais e com título editável.
 * Texto precisa de corpo; vídeo e link precisam de URL.
 */
export const projectSectionSchema = z
  .object({
    kind: z.enum(["text", "video", "link"]),
    title: z.string().trim().optional().default(""),
    body: z.string().trim().optional().default(""),
    url: z.string().trim().optional().default(""),
  })
  .superRefine((section, ctx) => {
    if (section.kind === "text" && !section.body && !section.title) {
      ctx.addIssue({ code: "custom", message: "Escreva o texto da seção (ou remova a seção)." });
    }
    if ((section.kind === "video" || section.kind === "link") && !section.url) {
      ctx.addIssue({ code: "custom", message: "Informe a URL." });
    }
    if (section.url && !/^https?:\/\//.test(section.url)) {
      ctx.addIssue({ code: "custom", message: "A URL precisa começar com http:// ou https://." });
    }
  });

export const projectSectionsSchema = z.array(projectSectionSchema);

export const galleryImageSchema = z.object({
  image_url: z.string().trim().min(1),
  alt_text: z.string().trim().min(1, "Descreva a imagem (texto alternativo)."),
  position: positionSchema,
});
