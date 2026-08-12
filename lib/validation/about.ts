import { z } from "zod";

export const aboutSchema = z.object({
  photo_url: z.string().trim().min(1, "Envie a foto."),
  photo_alt: z.string().trim().min(1, "Descreva a foto (texto alternativo)."),
  bio_main_text: z.string().trim().min(1, "Preencha o texto \"Quem é a Nat?\"."),
  bio_secondary_text: z.string().trim().min(1, "Preencha o texto \"Um relacionamento\"."),
  resume_url: z.string().trim().optional().default(""),
  linkedin_url: z.string().trim().optional().default(""),
  email: z.string().trim().email("Digite um e-mail válido."),
  whatsapp_number: z.string().trim().min(8, "Informe o número com DDD e país."),
});

export type AboutFormValues = z.infer<typeof aboutSchema>;
