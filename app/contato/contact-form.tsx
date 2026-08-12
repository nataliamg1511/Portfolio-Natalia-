"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { contactSchema, type ContactFormValues } from "@/lib/validation/contact";
import { submitContactForm } from "@/app/contato/actions";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting");
    setServerError(null);

    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("message", values.message);

    const result = await submitContactForm({ ok: false }, formData);

    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setServerError(result.error ?? "Não conseguimos enviar sua mensagem agora.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.28, ease: [0.2, 0, 0, 1] }}
        className="max-w-lg border border-border px-8 py-12"
      >
        <h2 className="font-display text-2xl font-medium text-foreground">Mensagem enviada.</h2>
        <p className="mt-3 text-[1.0625rem] leading-[1.65] text-muted-foreground">
          Retorno em breve.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          Nome*
        </Label>
        <Input id="name" autoComplete="name" {...register("name")} aria-invalid={!!errors.name} />
        {errors.name && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5" aria-hidden /> {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          E-mail*
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5" aria-hidden /> {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-foreground">
          Mensagem*
        </Label>
        <Textarea
          id="message"
          rows={6}
          {...register("message")}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5" aria-hidden /> {errors.message.message}
          </p>
        )}
      </div>

      {status === "error" && serverError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-1.5 rounded-[0.25rem] bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-[background-color,transform] duration-180 hover:bg-primary/90 active:not-disabled:translate-y-px disabled:opacity-60"
      >
        {status === "submitting" ? (
          "Enviando…"
        ) : (
          <>
            <span>Enviar</span>
            <span className="arrow-trailing" aria-hidden>
              →
            </span>
          </>
        )}
      </button>
    </form>
  );
}
