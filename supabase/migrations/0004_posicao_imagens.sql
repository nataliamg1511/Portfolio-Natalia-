-- 0004 — Seletor de posição/enquadramento de imagem no admin.
-- Idempotente (seguro colar no SQL Editor mais de uma vez).
--
-- Decisão sobre a galeria do case (app/projetos/[slug]/page.tsx): as
-- imagens de `project_gallery_images` são renderizadas com aspect ratio
-- fixo (`aspect-[4/3]`) + `object-cover` — ou seja, também sofrem crop
-- automático, exatamente como a capa/hover. Por isso ganham a mesma coluna
-- `position` aqui, com o mesmo tratamento ponta a ponta (admin + público).

alter table public.projects
  add column if not exists cover_image_position text not null default '50% 50%';

alter table public.projects
  add column if not exists hover_image_position text not null default '50% 50%';

alter table public.project_gallery_images
  add column if not exists position text not null default '50% 50%';

alter table public.about
  add column if not exists photo_position text not null default '50% 50%';
