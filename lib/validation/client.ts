import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().trim().min(2, "Escreva o nome do cliente."),
  logo_url: z.string().trim().min(1, "Envie a logo."),
  logo_alt: z.string().trim().min(1, "Descreva a logo (texto alternativo)."),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
