import { Mail } from "lucide-react";
import { ArrowLink } from "@/components/ui/arrow-link";
import { LinkedinIcon } from "@/components/ui/linkedin-icon";
import { FadeIn } from "@/components/motion/fade-in";

const LINKEDIN_URL = "https://www.linkedin.com/in/natalia-machado-gumerato/";
const EMAIL = "nataliamg.1511@gmail.com";

/**
 * Hero minimalista da Home — DESIGN_SYSTEM.md tokens `display` (Fraunces
 * 500, 72px desktop / 44px mobile, tracking -0.02em). Único elemento acima
 * da dobra além do header; sem imagem de fundo, sem carrossel.
 */
export function Hero() {
  return (
    <section className="container-editorial py-24 md:py-32 lg:py-40">
      <FadeIn>
        <h1 className="font-display text-[2.75rem] leading-[1.05] font-medium tracking-[-0.02em] text-foreground md:text-[4.5rem]">
          Oi, eu sou a Nat.
          <br />
          Redatora e Copywriter.
        </h1>
      </FadeIn>
      <FadeIn delay={0.08}>
        <div className="mt-8 flex items-center gap-6">
          <ArrowLink href="/sobre">Sobre mim</ArrowLink>
          <div className="flex items-center gap-4">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Perfil da Natália no LinkedIn (abre em nova aba)"
              className="text-foreground/70 transition-colors duration-180 hover:text-accent"
            >
              <LinkedinIcon size={20} strokeWidth={1.75} aria-hidden />
            </a>
            <a
              href={`mailto:${EMAIL}`}
              aria-label="Enviar e-mail para a Natália"
              className="text-foreground/70 transition-colors duration-180 hover:text-accent"
            >
              <Mail size={20} strokeWidth={1.75} aria-hidden />
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
