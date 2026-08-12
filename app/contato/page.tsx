import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FadeIn } from "@/components/motion/fade-in";
import { ContactForm } from "@/app/contato/contact-form";
import { getAbout } from "@/lib/data/about";
import { whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Natália Machado: formulário, LinkedIn, e-mail ou WhatsApp.",
  alternates: { canonical: "/contato" },
};

export const revalidate = 60;

export default async function ContatoPage() {
  const { about } = await getAbout();

  const directContacts = [
    { label: "LinkedIn", value: "linkedin.com/in/nataliamachado", href: about.linkedin_url },
    { label: "E-mail", value: about.email, href: `mailto:${about.email}` },
    {
      label: "WhatsApp",
      value: "+55 41 98532-4358",
      href: whatsappLink(about.whatsapp_number, "Oi, Natália! Vi seu portfólio e quero falar com você."),
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
        </section>

        <section className="container-editorial grid grid-cols-1 gap-16 pb-24 md:grid-cols-[1fr_minmax(0,280px)] md:pb-40">
          <FadeIn delay={0.06}>
            <ContactForm />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div>
              <p className="meta-text">Contato direto</p>
              <ul className="mt-4 space-y-4">
                {directContacts.map((contact) => (
                  <li key={contact.label}>
                    <a
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline block text-sm font-medium text-foreground"
                    >
                      {contact.label}
                    </a>
                    <span className="text-xs text-muted-foreground">{contact.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
