import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FadeIn } from "@/components/motion/fade-in";
import { LinkedinIcon } from "@/components/ui/linkedin-icon";
import { WhatsappIcon } from "@/components/ui/whatsapp-icon";
import { getAbout } from "@/lib/data/about";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Natália Machado pelo WhatsApp, LinkedIn ou por e-mail.",
  alternates: { canonical: "/contato" },
};

export const revalidate = 60;

/** "5541985324358" → "+55 41 98532-4358" (melhor de ler que o número corrido). */
function formatWhatsappDisplay(digits: string) {
  const br = digits.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  if (br) return `+55 ${br[1]} ${br[2]}-${br[3]}`;
  return `+${digits}`;
}

export default async function ContatoPage() {
  const { about } = await getAbout();

  const whatsappDigits = about.whatsapp_number.replace(/\D/g, "");

  const channels = [
    ...(whatsappDigits
      ? [
          {
            label: "WhatsApp",
            value: formatWhatsappDisplay(whatsappDigits),
            href: `https://wa.me/${whatsappDigits}`,
            icon: WhatsappIcon,
            external: true,
          },
        ]
      : []),
    {
      label: "LinkedIn",
      value: "Perfil profissional",
      href: about.linkedin_url,
      icon: LinkedinIcon,
      external: true,
    },
    {
      label: "E-mail",
      value: about.email,
      href: `mailto:${about.email}`,
      icon: Mail,
      external: false,
    },
  ];

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="container-editorial py-16 md:py-24">
          <FadeIn>
            <h1 className="font-display text-4xl font-medium tracking-[-0.015em] text-foreground md:text-5xl">
              Vamos conversar?
            </h1>
          </FadeIn>
          <FadeIn delay={0.06}>
            <p className="mt-6 max-w-lg text-[1.25rem] leading-[1.6] text-muted-foreground">
              Me chama no WhatsApp, escreve pelo LinkedIn ou manda um e-mail (respondo rapidinho)
            </p>
          </FadeIn>
        </section>

        <section className="container-editorial pb-24 md:pb-40">
          <ul className="max-w-xl divide-y divide-border border-y border-border">
            {channels.map((channel, index) => (
              <li key={channel.label}>
                <FadeIn delay={0.06 + index * 0.06}>
                  <a
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center justify-between gap-6 py-8 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  >
                    <span className="flex items-center gap-4">
                      <channel.icon
                        size={22}
                        strokeWidth={1.75}
                        className="text-muted-foreground transition-colors duration-180 group-hover:text-accent"
                        aria-hidden
                      />
                      <span>
                        <span className="link-underline block font-display text-2xl font-medium text-foreground md:text-3xl">
                          {channel.label}
                        </span>
                        <span className="meta-text mt-2 block normal-case tracking-normal">
                          {channel.value}
                        </span>
                      </span>
                    </span>
                    <span className="arrow-trailing text-2xl text-foreground" aria-hidden>
                      →
                    </span>
                  </a>
                </FadeIn>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
