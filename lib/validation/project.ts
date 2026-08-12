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
  context_text: z.string().trim().min(1, "Conte o contexto do cliente."),
  challenge_text: z.string().trim().min(1, "Conte o desafio."),
  solution_text: z.string().trim().min(1, "Conte a solução criativa."),
  result_text: z.string().trim().min(1, "Conte o resultado."),
  status: z.enum(["draft", "published"]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const galleryImageSchema = z.object({
  image_url: z.string().trim().min(1),
  alt_text: z.string().trim().min(1, "Descreva a imagem (texto alternativo)."),
  position: positionSchema,
});
