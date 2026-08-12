import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Preencha seu nome.").max(120, "Nome muito longo."),
  email: z
    .string()
    .trim()
    .min(1, "Preencha seu e-mail.")
    .max(254, "E-mail muito longo.")
    .email("Digite um e-mail válido."),
  message: z
    .string()
    .trim()
    .min(10, "Escreva uma mensagem com pelo menos 10 caracteres.")
    .max(5000, "Mensagem muito longa (máximo de 5000 caracteres)."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
