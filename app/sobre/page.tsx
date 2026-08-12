import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { getAbout } from "@/lib/data/about";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Quem é a Natália Machado — redatora publicitária, contas atendidas, ferramentas e currículo.",
  alternates: { canonical: "/sobre" },
};

export const revalidate = 60;

function paragraphs(text: string) {
  return text.split("\n\n").filter(Boolean);
}

export default async function SobrePage() {
  const { about } = await getAbout();

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="container-editorial grid grid-cols-1 gap-12 py-16 md:grid-cols-[minmax(0,340px)_1fr] md:gap-16 md:py-24">
          <FadeIn>
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden bg-secondary">
              <Image
                src={about.photo_url}
                alt={about.photo_alt}
                fill
                sizes="(min-width: 768px) 340px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h1 className="font-display text-4xl font-medium tracking-[-0.015em] text-foreground md:text-5xl">
              Quem é a Nat?
            </h1>
            <div className="mt-6 space-y-5 text-[1.0625rem] leading-[1.65] text-foreground/90">
              {paragraphs(about.bio_main_text).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </FadeIn>
        </section>

        <section className="container-editorial max-w-2xl py-16 md:py-24">
          <FadeIn>
            <h2 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground md:text-[2rem]">
              Um relacionamento
            </h2>
            <div className="mt-6 space-y-5 text-[1.0625rem] leading-[1.65] text-foreground/90">
              {paragraphs(about.bio_secondary_text).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </FadeIn>
        </section>

        <section className="container-editorial py-16 md:py-24">
          <FadeIn>
            <h2 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground md:text-[2rem]">
              Clientes e contas atendidas
            </h2>
            <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-3">
              {about.clients.map((client) => (
                <li key={client} className="meta-text border border-border px-3 py-2">
                  {client}
                </li>
              ))}
            </ul>
          </FadeIn>
        </section>

        <section className="container-editorial py-16 md:py-24">
          <FadeIn>
            <h2 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground md:text-[2rem]">
              Ferramentas e IAs
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {about.tools.map((tool) => (
                <Badge key={tool} variant="secondary" className="rounded-sm px-3 py-1.5 text-xs font-medium">
                  {tool}
                </Badge>
              ))}
            </div>
          </FadeIn>
        </section>

        <section className="container-editorial pb-24 pt-8 md:pb-40">
          <FadeIn>
            {about.resume_url ? (
              <a
                href={about.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors duration-180 hover:bg-primary/90 active:translate-y-px"
              >
                <span>Ver currículo</span>
                <span className="arrow-trailing" aria-hidden>
                  →
                </span>
              </a>
            ) : (
              <p className="meta-text">Currículo em breve</p>
            )}
          </FadeIn>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
