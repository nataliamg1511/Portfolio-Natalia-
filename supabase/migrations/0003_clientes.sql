-- 0003 — Vitrine de logos de clientes ("Pra quem já escrevi" na Home).
-- Rodar no SQL Editor do Supabase DEPOIS de 0001_initial.sql + seed.sql
-- (+ 0002_imagens_reais.sql, se já não tiver rodado). Este arquivo já
-- inclui os INSERTs das 22 logos — não precisa de um seed.sql separado.
-- Seguro rodar mais de uma vez (unique em `name` + `on conflict do nothing`).

-- ────────────────────────────────────────────────────────────────────────
-- clients
-- ────────────────────────────────────────────────────────────────────────
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  logo_url text not null,
  logo_alt text not null default '',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_order_idx on public.clients (display_order);

drop trigger if exists set_clients_updated_at on public.clients;
create trigger set_clients_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────
-- Row Level Security — mesmo padrão da tabela `about`: sem rascunho, toda
-- logo cadastrada é pública para leitura; escrita só autenticado.
-- ────────────────────────────────────────────────────────────────────────
alter table public.clients enable row level security;

create policy "clients_public_select"
  on public.clients for select
  to anon
  using (true);

create policy "clients_authenticated_select"
  on public.clients for select
  to authenticated
  using (true);

create policy "clients_authenticated_insert"
  on public.clients for insert
  to authenticated
  with check (true);

create policy "clients_authenticated_update"
  on public.clients for update
  to authenticated
  using (true)
  with check (true);

create policy "clients_authenticated_delete"
  on public.clients for delete
  to authenticated
  using (true);

-- ────────────────────────────────────────────────────────────────────────
-- Seed — as 22 logos, mesma ordem do site antigo. Arquivos servidos de
-- public/clients/*.png (caminho local, sem depender do Supabase Storage —
-- mesmo padrão dos placeholders de projeto). Novas logos cadastradas pelo
-- /admin/clientes vão para o bucket `project-images` (pasta clients/).
-- ────────────────────────────────────────────────────────────────────────
insert into public.clients (name, logo_url, logo_alt, display_order) values
  ('Above', '/clients/above.png', 'Logo da Above', 1),
  ('Unilever', '/clients/unilever.png', 'Logo da Unilever', 2),
  ('Electrolux', '/clients/electrolux.png', 'Logo da Electrolux', 3),
  ('Ademicon', '/clients/ademicon.png', 'Logo da Ademicon', 4),
  ('Eurofarma', '/clients/eurofarma.png', 'Logo da Eurofarma', 5),
  ('BeautyColor', '/clients/beautycolor.png', 'Logo da BeautyColor', 6),
  ('MSD Saúde Animal', '/clients/msd-saude-animal.png', 'Logo da MSD Saúde Animal', 7),
  ('Beneficência Portuguesa', '/clients/beneficencia-portuguesa.png', 'Logo da Beneficência Portuguesa', 8),
  ('Suzano', '/clients/suzano.png', 'Logo da Suzano', 9),
  ('Coamo', '/clients/coamo.png', 'Logo da Coamo', 10),
  ('Sanepar', '/clients/sanepar.png', 'Logo da Sanepar', 11),
  ('Grupo Muffato', '/clients/grupo-muffato.png', 'Logo do Grupo Muffato', 12),
  ('Prefeitura de Curitiba', '/clients/prefeitura-de-curitiba.png', 'Logo da Prefeitura de Curitiba', 13),
  ('Sepac', '/clients/sepac.png', 'Logo da Sepac', 14),
  ('Daju', '/clients/daju.png', 'Logo da Daju', 15),
  ('Compagas', '/clients/compagas.png', 'Logo da Compagas', 16),
  ('Grupo Barigüi', '/clients/grupo-barigui.png', 'Logo do Grupo Barigüi', 17),
  ('GT.Home ABC', '/clients/gt-home-abc.png', 'Logo da GT.Home ABC', 18),
  ('Minipreço', '/clients/minipreco.png', 'Logo da Minipreço', 19),
  ('Pátio Batel', '/clients/patio-batel.png', 'Logo da Pátio Batel', 20),
  ('Ser Educacional', '/clients/ser-educacional.png', 'Logo da Ser Educacional', 21),
  ('Sonner', '/clients/sonner.png', 'Logo da Sonner', 22)
on conflict (name) do nothing;
