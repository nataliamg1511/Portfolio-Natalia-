import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/motion/fade-in";
import { RichText } from "@/components/rich-text";
import { formatMeta, truncateForMeta } from "@/lib/format";
import { getVideoEmbedUrl } from "@/lib/video";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data/projects";
import type { ProjectSection } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const firstText = project.sections.find((s) => s.kind === "text" && s.body);
  const description = firstText
    ? truncateForMeta(firstText.body)
    : `${project.title} — case de ${project.category.toLowerCase()} no portfólio de Natália Machado.`;

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projetos/${project.slug}` },
    openGraph: {
      title: project.title,
      description,
      images: [{ url: project.cover_image_url }],
    },
  };
}

function SectionContent({ section }: { section: ProjectSection }) {
  if (section.kind === "video") {
    const embedUrl = getVideoEmbedUrl(section.url);
    if (!embedUrl) {
      return <SectionLink title={section.title || "Assistir ao vídeo"} url={section.url} />;
    }
    return (
      <figure>
        <div className="relative aspect-video w-full overflow-hidden bg-secondary">
          <iframe
            src={embedUrl}
            title={section.title || "Vídeo do projeto"}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
        {section.title && (
          <figcaption className="meta-text mt-3 normal-case tracking-normal">{section.title}</figcaption>
        )}
      </figure>
    );
  }

  if (section.kind === "link") {
    return <SectionLink title={section.title || section.url} url={section.url} />;
  }

  return (
    <>
      {section.title && <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>}
      <RichText
        text={section.body}
        className="mt-3 space-y-4 text-[1.0625rem] leading-[1.65] text-foreground/90"
      />
    </>
  );
}

function SectionLink({ title, url }: { title: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-underline inline-flex items-center gap-1.5 text-base font-medium text-foreground"
    >
      <span>{title}</span>
      <span className="arrow-trailing" aria-hidden>
        →
      </span>
    </a>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const allProjects = await getPublishedProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const nextProject =
    allProjects.length > 1 ? allProjects[(currentIndex + 1) % allProjects.length] : null;
  const previousProject =
    allProjects.length > 1
      ? allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length]
      : null;

  const sections = project.sections;
  const gallery = project.gallery ?? [];

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <header className="container-editorial pt-16 pb-10 md:pt-24">
          <FadeIn>
            <p className="meta-text">
              {formatMeta([project.category, project.year, project.client])}
            </p>
            <h1 className="font-display mt-4 max-w-3xl text-4xl font-medium tracking-[-0.015em] text-foreground md:text-5xl">
              {project.title}
            </h1>
            {project.award && (
              <div className="mt-6 inline-flex items-center gap-2 border border-accent px-3 py-1.5">
                <Trophy className="size-4 text-accent" strokeWidth={1.75} aria-hidden />
                <span className="meta-text text-accent">Vencedor do prêmio {project.award}</span>
              </div>
            )}
          </FadeIn>
        </header>

        <FadeIn y={20} margin="-5% 0px">
          <div className="relative mx-auto aspect-[16/10] w-full max-w-[1440px]">
            <Image
              src={project.cover_image_url}
              alt={project.cover_image_alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: project.cover_image_position }}
            />
          </div>
        </FadeIn>

        <div className="container-editorial py-16 md:py-24">
          {sections.map((section, index) => (
            <div key={section.id}>
              <FadeIn
                className={
                  section.kind === "video"
                    ? "mx-auto max-w-4xl py-10 md:py-14"
                    : "mx-auto max-w-2xl py-10 md:py-14"
                }
              >
                <SectionContent section={section} />
              </FadeIn>

              {gallery[index] && (
                <FadeIn y={20} margin="-5% 0px">
                  <div className="relative mx-auto aspect-[4/3] w-full max-w-4xl">
                    <Image
                      src={gallery[index].image_url}
                      alt={gallery[index].alt_text}
                      fill
                      sizes="(min-width: 1024px) 900px, 100vw"
                      className="object-cover"
                      style={{ objectPosition: gallery[index].position }}
                    />
                  </div>
                </FadeIn>
              )}

              {index < sections.length - 1 && <Separator className="my-16" />}
            </div>
          ))}

          {gallery.slice(sections.length).map((image) => (
            <FadeIn key={image.id} className="mx-auto max-w-4xl py-6" y={20} margin="-5% 0px">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={image.image_url}
                  alt={image.alt_text}
                  fill
                  sizes="(min-width: 1024px) 900px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: image.position }}
                />
              </div>
            </FadeIn>
          ))}
        </div>

        {(nextProject || previousProject) && (
          <nav
            aria-label="Navegação entre projetos"
            className="container-editorial grid grid-cols-1 gap-8 border-t border-border py-16 sm:grid-cols-2"
          >
            {previousProject && (
              <Link
                href={`/projetos/${previousProject.slug}`}
                className="group flex items-center gap-4 rounded-none outline-none transition-transform duration-180 ease-[cubic-bezier(0.3,0,0,1)] hover:-translate-x-1 focus-visible:-translate-x-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <div className="relative aspect-4/3 w-24 shrink-0 overflow-hidden bg-secondary">
                  <Image
                    src={previousProject.cover_image_url}
                    alt={previousProject.cover_image_alt}
                    fill
                    sizes="96px"
                    className="object-cover transition-opacity duration-180 group-hover:opacity-85"
                    style={{ objectPosition: previousProject.cover_image_position }}
                  />
                </div>
                <div>
                  <p className="meta-text inline-flex items-center gap-1.5">
                    <span className="arrow-leading" aria-hidden>
                      ←
                    </span>
                    <span>Projeto anterior</span>
                  </p>
                  <h2 className="font-display mt-1 text-lg font-medium text-foreground">
                    {previousProject.title}
                  </h2>
                </div>
              </Link>
            )}
            {nextProject && (
              <Link
                href={`/projetos/${nextProject.slug}`}
                className="group flex items-center justify-end gap-4 rounded-none text-right outline-none transition-transform duration-180 ease-[cubic-bezier(0.3,0,0,1)] hover:translate-x-1 focus-visible:translate-x-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:col-start-2"
              >
                <div>
                  <p className="meta-text inline-flex items-center gap-1.5">
                    <span>Próximo projeto</span>
                    <span className="arrow-trailing" aria-hidden>
                      →
                    </span>
                  </p>
                  <h2 className="font-display mt-1 text-lg font-medium text-foreground">
                    {nextProject.title}
                  </h2>
                </div>
                <div className="relative aspect-4/3 w-24 shrink-0 overflow-hidden bg-secondary">
                  <Image
                    src={nextProject.cover_image_url}
                    alt={nextProject.cover_image_alt}
                    fill
                    sizes="96px"
                    className="object-cover transition-opacity duration-180 group-hover:opacity-85"
                    style={{ objectPosition: nextProject.cover_image_position }}
                  />
                </div>
              </Link>
            )}
          </nav>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
