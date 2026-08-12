import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ArrowLink } from "@/components/ui/arrow-link";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="container-editorial flex flex-col items-start py-32 md:py-48">
        <p className="meta-text">Erro 404</p>
        <h1 className="font-display mt-4 text-4xl font-medium tracking-[-0.015em] text-foreground md:text-5xl">
          Essa página não existe.
        </h1>
        <p className="mt-4 max-w-md text-[1.0625rem] leading-[1.65] text-muted-foreground">
          O projeto pode ter sido despublicado ou o endereço está errado. Volta pra ver o resto do
          trabalho.
        </p>
        <div className="mt-8">
          <ArrowLink href="/#projetos">Voltar para projetos</ArrowLink>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
