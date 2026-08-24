import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { ClientMarquee } from "@/components/sections/client-marquee";
import { RichText } from "@/components/rich-text";
import { getAbout } from "@/lib/data/about";
import { getClients } from "@/lib/data/clients";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Quem é a Natália Machado — redatora e copywriter, marcas atendidas, ferramentas e currículo.",
  alternates: { canonical: "/sobre" },
};

export const revalidate = 60;

export default async function SobrePage() {
  const [{ about }, { clients }] = await Promise.all([getAbout(), getClients()]);

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
                style={{ objectPosition: about.photo_position }}
                priority
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h1 className="font-display text-4xl font-medium tracking-[-0.015em] text-foreground md:text-5xl">
              Quem é a Nat?
            </h1>
            <RichText
              text={about.bio_main_text}
              className="mt-6 space-y-5 text-[1.0625rem] leading-[1.65] text-foreground/90"
            />
          </FadeIn>
        </section>

        <section className="container-editorial max-w-2xl pb-10 pt-2 md:pb-14">
          <FadeIn>
            <h2 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground md:text-[2rem]">
              Um relacionamento
            </h2>
            <RichText
              text={about.bio_secondary_text}
              className="mt-6 space-y-5 text-[1.0625rem] leading-[1.65] text-foreground/90"
            />
          </FadeIn>
        </section>

        <section className="container-editorial py-10 md:py-14">
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

        <section className="container-editorial pb-16 pt-6 md:pb-20">
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

        {/* Mesma vitrine animada de logos da Home, no lugar da antiga lista
            de tags "Clientes e contas atendidas". */}
        <ClientMarquee clients={clients} />

        <section className="container-editorial border-t border-border py-20 md:py-28">
          <FadeIn>
            <h2 className="font-display max-w-2xl text-3xl font-medium tracking-[-0.015em] text-foreground md:text-4xl">
              Gostou do que leu? Então bora conversar sobre o seu projeto.
            </h2>
            <Link
              href="/contato"
              className="mt-8 inline-flex items-center gap-1.5 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors duration-180 hover:bg-primary/90 active:translate-y-px"
            >
              <span>Fale comigo</span>
              <span className="arrow-trailing" aria-hidden>
                →
              </span>
            </Link>
          </FadeIn>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
