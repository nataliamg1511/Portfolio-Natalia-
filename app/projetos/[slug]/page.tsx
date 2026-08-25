import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/motion/fade-in";
import { CaseCarousel } from "@/components/sections/case-carousel";
import { RichText } from "@/components/rich-text";
import { cn } from "@/lib/utils";
import { formatMeta, truncateForMeta } from "@/lib/format";
import { getVideoEmbedUrl, isVideoFileUrl } from "@/lib/video";
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
    // Vídeo vertical (9:16) vive numa moldura estreita pra não dominar a
    // página; horizontal ocupa a largura do bloco em 16:9.
    const vertical = section.aspect === "9:16";
    const frameWrap = vertical
      ? cn("w-full max-w-sm", ALIGN_CLASS[section.align] ?? "mx-auto")
      : "w-full";

    if (isVideoFileUrl(section.url)) {
      return (
        <figure className={frameWrap}>
          <video
            src={section.url}
            controls
            playsInline
            preload="metadata"
            className={cn("w-full bg-secondary", vertical && "aspect-[9/16] object-cover")}
          />
          {section.title && (
            <figcaption className="meta-text mt-3 normal-case tracking-normal">{section.title}</figcaption>
          )}
        </figure>
      );
    }

    const embedUrl = getVideoEmbedUrl(section.url);
    if (!embedUrl) {
      return <SectionLink title={section.title || "Assistir ao vídeo"} url={section.url} />;
    }
    return (
      <figure className={frameWrap}>
        <div
          className={cn(
            "relative w-full overflow-hidden bg-secondary",
            vertical ? "aspect-[9/16]" : "aspect-video"
          )}
        >
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

  if (section.kind === "carousel") {
    return (
      <figure>
        <CaseCarousel items={section.items} label={section.title || undefined} />
        {section.title && (
          <figcaption className="meta-text mt-3 normal-case tracking-normal">{section.title}</figcaption>
        )}
      </figure>
    );
  }

  if (section.kind === "image") {
    // O corte segue a proporção escolhida no admin; sem corte ("Original"),
    // a imagem respeita a proporção natural do arquivo.
    const ratioClass = section.aspect ? IMAGE_RATIO_CLASS[section.aspect] : null;
    return (
      <figure>
        <div className="group overflow-hidden bg-secondary">
          {ratioClass ? (
            <div className={cn("relative w-full", ratioClass)}>
              <Image
                src={section.url}
                alt={section.image_alt}
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.02]"
                style={{ objectPosition: section.position }}
              />
            </div>
          ) : (
            <Image
              src={section.url}
              alt={section.image_alt}
              width={1600}
              height={1200}
              sizes="(min-width: 1024px) 900px, 100vw"
              className="h-auto w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.02]"
            />
          )}
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

/** Molduras de corte das imagens do case (aspect escolhido no admin). */
const IMAGE_RATIO_CLASS: Record<string, string> = {
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
  "3:4": "aspect-[3/4]",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
};

const WIDTH_CLASS: Record<string, string> = {
  small: "max-w-md",
  contained: "max-w-2xl",
  wide: "max-w-4xl",
  half: "max-w-xl",
};

const ALIGN_CLASS: Record<string, string> = {
  center: "mx-auto",
  left: "mr-auto",
  right: "ml-auto",
};

type RenderItem =
  | { type: "single"; section: ProjectSection }
  | { type: "pair"; sections: [ProjectSection, ProjectSection] };

/** Dois blocos "metade" consecutivos formam uma dupla lado a lado. */
function groupSections(sections: ProjectSection[]): RenderItem[] {
  const items: RenderItem[] = [];
  let i = 0;
  while (i < sections.length) {
    const current = sections[i];
    const next = sections[i + 1];
    if (current.layout === "half" && next?.layout === "half") {
      items.push({ type: "pair", sections: [current, next] });
      i += 2;
    } else {
      items.push({ type: "single", section: current });
      i += 1;
    }
  }
  return items;
}

function SectionBlock({ section }: { section: ProjectSection }) {
  const isMedia =
    section.kind === "image" || section.kind === "video" || section.kind === "carousel";

  if (section.layout === "full" && isMedia) {
    return (
      <FadeIn y={20} margin="-5% 0px" className={section.kind === "image" ? "py-6" : "py-8"}>
        <SectionContent section={section} />
      </FadeIn>
    );
  }

  return (
    <FadeIn
      y={isMedia ? 20 : 16}
      margin={isMedia ? "-5% 0px" : "-10% 0px"}
      className={cn("container-editorial", isMedia ? "py-6 md:py-8" : "py-10 md:py-14")}
    >
      <div className={cn(WIDTH_CLASS[section.layout] ?? "max-w-4xl", ALIGN_CLASS[section.align] ?? "mx-auto")}>
        <SectionContent section={section} />
      </div>
    </FadeIn>
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

  const items = groupSections(project.sections);

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        {/* A capa/hover são exclusivas do card da Home — a página do case é
            montada inteiramente pelos blocos definidos no admin. */}
        <header className="container-editorial border-b border-border pt-16 pb-12 md:pt-24 md:pb-16">
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

        <div className="py-8 md:py-12">
          {items.map((item, index) => {
            if (item.type === "pair") {
              const [a, b] = item.sections;
              return (
                <FadeIn key={a.id} y={20} margin="-5% 0px" className="container-editorial py-6 md:py-8">
                  <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-6 md:grid-cols-2">
                    <SectionContent section={a} />
                    <SectionContent section={b} />
                  </div>
                </FadeIn>
              );
            }

            const section = item.section;
            const previous = index > 0 ? items[index - 1] : null;
            const separatorBetweenTexts =
              section.kind === "text" &&
              previous?.type === "single" &&
              previous.section.kind === "text";

            return (
              <div key={section.id}>
                {separatorBetweenTexts && (
                  <div className="container-editorial">
                    <Separator className="mx-auto my-6 max-w-2xl" />
                  </div>
                )}
                <SectionBlock section={section} />
              </div>
            );
          })}
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
