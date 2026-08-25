import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/data/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nataliamachado.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();

  const staticRoutes: MetadataRoute.Sitemap = ["", "/sobre", "/contato"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.6,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projetos/${project.slug}`,
    lastModified: project.updated_at,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
