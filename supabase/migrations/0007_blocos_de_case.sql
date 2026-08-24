-- 0007 — Blocos de case: imagens viram seções + controles de layout.
--
-- A galeria intercalada automaticamente (imagem N depois da seção N) dá
-- lugar a blocos únicos e reordenáveis: `project_sections` ganha o tipo
-- 'image' e colunas de layout (largura/alinhamento/enquadramento), e as
-- imagens de `project_gallery_images` são copiadas como blocos `image`
-- exatamente nas posições em que o site já as renderizava — nenhum case
-- muda de aparência, mas tudo passa a ser arrastável no admin.
--
-- `project_gallery_images` fica intacta (fallback de leitura para código
-- antigo); o admin novo limpa as linhas legadas de um projeto ao salvá-lo.
--
-- Rode UMA vez, junto do deploy do código novo. Re-rodar não duplica
-- blocos; só re-aplica a largura padrão em cases que não têm imagens.

-- 1. Tipo 'image' passa a ser aceito
alter table public.project_sections
  drop constraint if exists project_sections_kind_check;

alter table public.project_sections
  add constraint project_sections_kind_check
  check (kind in ('text', 'video', 'link', 'image'));

-- 2. Colunas de layout por bloco
alter table public.project_sections
  add column if not exists image_alt text not null default '';

alter table public.project_sections
  add column if not exists layout text not null default 'wide';

alter table public.project_sections
  add column if not exists align text not null default 'center';

alter table public.project_sections
  add column if not exists position text not null default '50% 50%';

alter table public.project_sections
  drop constraint if exists project_sections_layout_check;

alter table public.project_sections
  add constraint project_sections_layout_check
  check (layout in ('contained', 'wide', 'half', 'full'));

alter table public.project_sections
  drop constraint if exists project_sections_align_check;

alter table public.project_sections
  add constraint project_sections_align_check
  check (align in ('left', 'center', 'right'));

-- 3. Texto usa a coluna de leitura por padrão (o default 'wide' é pra mídia).
--    Guardado por "projeto ainda sem blocos de imagem" pra não desfazer
--    escolhas manuais depois que a migração de imagens (passo 4) já rodou.
update public.project_sections s
set layout = 'contained'
where s.kind = 'text'
  and s.layout = 'wide'
  and not exists (
    select 1 from public.project_sections ps
    where ps.project_id = s.project_id and ps.kind = 'image'
  );

-- 4. Copia a galeria como blocos `image`, intercalados como o site exibia:
--    seção 1, imagem 1, seção 2, imagem 2…, imagens excedentes no fim.
--    Só para projetos que ainda não têm nenhum bloco de imagem (idempotente).

-- 4a. Abre espaço: seções existentes vão para 10, 20, 30…
update public.project_sections s
set display_order = t.rn * 10
from (
  select id, row_number() over (partition by project_id order by display_order, id) as rn
  from public.project_sections
) t
where s.id = t.id
  and exists (
    select 1 from public.project_gallery_images g where g.project_id = s.project_id
  )
  and not exists (
    select 1 from public.project_sections ps
    where ps.project_id = s.project_id and ps.kind = 'image'
  );

-- 4b. Imagem J entra em J*10+5 (logo depois da seção J; excedentes no fim)
insert into public.project_sections
  (project_id, kind, title, body, url, image_alt, layout, align, "position", display_order)
select
  g.project_id, 'image', '', '', g.image_url, g.alt_text, 'wide', 'center',
  coalesce(g."position", '50% 50%'),
  (row_number() over (partition by g.project_id order by g.display_order, g.id)) * 10 + 5
from public.project_gallery_images g
where not exists (
  select 1 from public.project_sections ps
  where ps.project_id = g.project_id and ps.kind = 'image'
);

-- 4c. Renumera tudo em sequência limpa (1, 2, 3…)
update public.project_sections s
set display_order = t.rn
from (
  select id, row_number() over (partition by project_id order by display_order, id) as rn
  from public.project_sections
) t
where s.id = t.id
  and s.display_order <> t.rn;
