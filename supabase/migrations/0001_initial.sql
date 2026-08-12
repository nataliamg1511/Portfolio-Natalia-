-- Portfólio Natália Machado — schema inicial
-- Baseado em UX_ARCHITECTURE.md seção 5 (Modelo de dados sugerido).

create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────────────────
-- projects
-- ────────────────────────────────────────────────────────────────────────
create type project_status as enum ('draft', 'published');

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  year integer not null,
  client text,
  award text,
  cover_image_url text not null,
  cover_image_alt text not null default '',
  hover_image_url text,
  hover_image_alt text,
  context_text text not null default '',
  challenge_text text not null default '',
  solution_text text not null default '',
  result_text text not null default '',
  status project_status not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_order_idx on public.projects (status, display_order);
create index if not exists projects_slug_idx on public.projects (slug);

-- ────────────────────────────────────────────────────────────────────────
-- project_gallery_images
-- ────────────────────────────────────────────────────────────────────────
create table if not exists public.project_gallery_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  image_url text not null,
  alt_text text not null default '',
  display_order integer not null default 0
);

create index if not exists project_gallery_images_project_idx
  on public.project_gallery_images (project_id, display_order);

-- ────────────────────────────────────────────────────────────────────────
-- about (linha única / singleton)
-- ────────────────────────────────────────────────────────────────────────
create table if not exists public.about (
  id uuid primary key default gen_random_uuid(),
  photo_url text not null default '',
  photo_alt text not null default '',
  bio_main_text text not null default '',
  bio_secondary_text text not null default '',
  clients jsonb not null default '[]'::jsonb,
  tools jsonb not null default '[]'::jsonb,
  resume_url text not null default '',
  linkedin_url text not null default '',
  email text not null default '',
  whatsapp_number text not null default '',
  updated_at timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────
-- messages
-- ────────────────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);

-- ────────────────────────────────────────────────────────────────────────
-- updated_at automático
-- ────────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists set_about_updated_at on public.about;
create trigger set_about_updated_at
  before update on public.about
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ────────────────────────────────────────────────────────────────────────
alter table public.projects enable row level security;
alter table public.project_gallery_images enable row level security;
alter table public.about enable row level security;
alter table public.messages enable row level security;

-- projects: leitura pública só do que está publicado; escrita só autenticado
create policy "projects_public_select_published"
  on public.projects for select
  to anon
  using (status = 'published');

create policy "projects_authenticated_select_all"
  on public.projects for select
  to authenticated
  using (true);

create policy "projects_authenticated_insert"
  on public.projects for insert
  to authenticated
  with check (true);

create policy "projects_authenticated_update"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

create policy "projects_authenticated_delete"
  on public.projects for delete
  to authenticated
  using (true);

-- project_gallery_images: leitura pública só de imagens de projeto publicado;
-- escrita só autenticado
create policy "gallery_public_select_published"
  on public.project_gallery_images for select
  to anon
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_gallery_images.project_id
        and p.status = 'published'
    )
  );

create policy "gallery_authenticated_select_all"
  on public.project_gallery_images for select
  to authenticated
  using (true);

create policy "gallery_authenticated_insert"
  on public.project_gallery_images for insert
  to authenticated
  with check (true);

create policy "gallery_authenticated_update"
  on public.project_gallery_images for update
  to authenticated
  using (true)
  with check (true);

create policy "gallery_authenticated_delete"
  on public.project_gallery_images for delete
  to authenticated
  using (true);

-- about: sempre público para leitura (não há rascunho de "sobre");
-- escrita só autenticado
create policy "about_public_select"
  on public.about for select
  to anon
  using (true);

create policy "about_authenticated_select"
  on public.about for select
  to authenticated
  using (true);

create policy "about_authenticated_insert"
  on public.about for insert
  to authenticated
  with check (true);

create policy "about_authenticated_update"
  on public.about for update
  to authenticated
  using (true)
  with check (true);

-- messages: insert público (formulário de contato); select/update só autenticado
create policy "messages_public_insert"
  on public.messages for insert
  to anon
  with check (true);

create policy "messages_authenticated_select"
  on public.messages for select
  to authenticated
  using (true);

create policy "messages_authenticated_update"
  on public.messages for update
  to authenticated
  using (true)
  with check (true);

create policy "messages_authenticated_delete"
  on public.messages for delete
  to authenticated
  using (true);

-- ────────────────────────────────────────────────────────────────────────
-- Storage — bucket público de imagens de projeto
-- ────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "project_images_public_read"
  on storage.objects for select
  to anon
  using (bucket_id = 'project-images');

create policy "project_images_authenticated_read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'project-images');

create policy "project_images_authenticated_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

create policy "project_images_authenticated_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

create policy "project_images_authenticated_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');
