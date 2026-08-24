-- Ajustes de projetos pedidos no doc de revisão (ago/2026):
--
-- 1. Nova ordem: #100vezesMaxim (vencedor de prêmio) → Prefeitura de
--    Curitiba → Aba CRM Unilever → Black Friday Oriba → DETRAN → Ditados
--    que Salvam → Insight contra o Racismo.
-- 2. Renomeia "Campanha Black Friday" → "Black Friday Oriba" (cliente Oriba)
--    e "Cartazes Outubro Rosa" → "Ditados que Salvam".
-- 3. Cria o case "Aba CRM Unilever" como rascunho (conteúdo/artes entram
--    pelo /admin antes de publicar).
--
-- Idempotente: pode rodar mais de uma vez sem duplicar nada.

update public.projects set title = 'Black Friday Oriba', client = 'Oriba'
where slug = 'campanha-black-friday';

update public.projects set title = 'Ditados que Salvam'
where slug = 'cartazes-outubro-rosa';

insert into public.projects (
  title, slug, category, year, client, award,
  cover_image_url, cover_image_alt, status, display_order
) values (
  'Aba CRM Unilever', 'aba-crm-unilever', 'CRM', 2023, 'Unilever', null,
  '/placeholders/aba-crm-unilever-capa.svg', 'Capa provisória do case Aba CRM Unilever.',
  'draft', 3
)
on conflict (slug) do nothing;

update public.projects set display_order = o.display_order
from (
  values
    ('100vezesmaxim', 1),
    ('jobs-prefeitura-curitiba', 2),
    ('aba-crm-unilever', 3),
    ('campanha-black-friday', 4),
    ('detran-seguranca-no-transito', 5),
    ('cartazes-outubro-rosa', 6),
    ('insight-campanha-contra-racismo', 7)
) as o(slug, display_order)
where projects.slug = o.slug;
