-- 0009 — Corte de livre escolha nas imagens do case.
--
-- A coluna `aspect` de project_sections (criada na 0008 pra orientação de
-- vídeo) passa a guardar também o corte das imagens: '' = original (sem
-- corte), ou 1:1 / 4:3 / 3:4 / 16:9 / 9:16.
--
-- Idempotente (seguro colar no SQL Editor mais de uma vez). Rode junto do
-- deploy do código que a acompanha: a leitura pública tem fallback, mas
-- salvar projeto no admin exige o check novo.

alter table public.project_sections
  drop constraint if exists project_sections_aspect_check;

alter table public.project_sections
  add constraint project_sections_aspect_check
  check (aspect in ('', '16:9', '9:16', '1:1', '4:3', '3:4'));

-- Antes da 0009, imagem com enquadramento personalizado era exibida com
-- corte 4:3 fixo — torna esse corte explícito pra nada mudar de aparência.
update public.project_sections
set aspect = '4:3'
where kind = 'image'
  and aspect = ''
  and position <> '50% 50%';
