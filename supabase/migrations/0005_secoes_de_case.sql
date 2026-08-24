-- Seções flexíveis de conteúdo do case.
--
-- Substitui os quatro campos fixos de projects (context_text, challenge_text,
-- solution_text, result_text) por uma tabela de seções ordenadas: cada seção
-- tem título editável e pode ser removida, e além de texto existem seções de
-- vídeo incorporado (YouTube/Vimeo) e de link.
--
-- Auto-contida: cria a tabela + RLS, copia os textos existentes como seções
-- (com os títulos clássicos) e esvazia as colunas antigas — o app deriva
-- seções das colunas antigas apenas quando esta migration ainda não rodou.

create table if not exists public.project_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  kind text not null default 'text' check (kind in ('text', 'video', 'link')),
  title text not null default '',
  body text not null default '',
  url text not null default '',
  display_order integer not null default 0
);

create index if not exists project_sections_project_idx
  on public.project_sections (project_id, display_order);

alter table public.project_sections enable row level security;

-- Mesmo desenho de RLS da galeria: leitura pública só de projeto publicado,
-- escrita só autenticado.
create policy "sections_public_select_published"
  on public.project_sections for select
  to anon
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_sections.project_id
        and p.status = 'published'
    )
  );

create policy "sections_authenticated_select_all"
  on public.project_sections for select
  to authenticated
  using (true);

create policy "sections_authenticated_insert"
  on public.project_sections for insert
  to authenticated
  with check (true);

create policy "sections_authenticated_update"
  on public.project_sections for update
  to authenticated
  using (true)
  with check (true);

create policy "sections_authenticated_delete"
  on public.project_sections for delete
  to authenticated
  using (true);

-- Copia os quatro textos de cada projeto como seções de texto, pulando os
-- vazios, e só para projetos que ainda não têm nenhuma seção (idempotente).
insert into public.project_sections (project_id, kind, title, body, display_order)
select p.id, 'text', s.title, s.body, s.display_order
from public.projects p
cross join lateral (
  values
    ('Contexto do cliente', p.context_text, 1),
    ('O desafio', p.challenge_text, 2),
    ('A solução criativa', p.solution_text, 3),
    ('O resultado', p.result_text, 4)
) as s(title, body, display_order)
where coalesce(trim(s.body), '') <> ''
  and not exists (
    select 1 from public.project_sections ps where ps.project_id = p.id
  );

-- Esvazia as colunas antigas para o app não derivar conteúdo duplicado.
update public.projects
set context_text = '', challenge_text = '', solution_text = '', result_text = ''
where context_text <> '' or challenge_text <> '' or solution_text <> '' or result_text <> '';
