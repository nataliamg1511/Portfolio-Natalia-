import { ArrowLink } from "@/components/ui/arrow-link";
import { FadeIn } from "@/components/motion/fade-in";

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
          Oi, eu sou a Natália.
          <br />
          Redatora publicitária.
        </h1>
      </FadeIn>
      <FadeIn delay={0.08}>
        <div className="mt-8">
          <ArrowLink href="/sobre">Sobre mim</ArrowLink>
        </div>
      </FadeIn>
    </section>
  );
}
