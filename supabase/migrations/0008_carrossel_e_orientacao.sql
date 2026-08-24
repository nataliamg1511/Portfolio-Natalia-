-- 0008 — Bloco carrossel + orientação de vídeo + tamanho "Pequena".
--
-- 1. `project_sections.kind` passa a aceitar 'carousel' (imagens e vídeos
--    lado a lado; itens guardados em `items` jsonb).
-- 2. `layout` passa a aceitar 'small' (opção "Pequena" na caixa de tamanho).
-- 3. Coluna `aspect` guarda a orientação do vídeo do bloco ('16:9'/'9:16';
--    vazio = legado, tratado como 16:9).
--
-- Idempotente (seguro colar no SQL Editor mais de uma vez). Rode junto do
-- deploy do código que a acompanha: a leitura pública tem fallback em
-- qualquer ordem, mas salvar projeto no admin exige estas colunas.

alter table public.project_sections
  drop constraint if exists project_sections_kind_check;

alter table public.project_sections
  add constraint project_sections_kind_check
  check (kind in ('text', 'video', 'link', 'image', 'carousel'));

alter table public.project_sections
  drop constraint if exists project_sections_layout_check;

alter table public.project_sections
  add constraint project_sections_layout_check
  check (layout in ('small', 'contained', 'wide', 'half', 'full'));

alter table public.project_sections
  add column if not exists aspect text not null default '';

alter table public.project_sections
  drop constraint if exists project_sections_aspect_check;

alter table public.project_sections
  add constraint project_sections_aspect_check
  check (aspect in ('', '16:9', '9:16'));

alter table public.project_sections
  add column if not exists items jsonb not null default '[]'::jsonb;
