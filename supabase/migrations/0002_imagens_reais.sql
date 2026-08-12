-- 0002 — Troca os placeholders SVG pelas peças reais das campanhas.
-- As imagens vivem no próprio site (public/projects/**), então basta
-- atualizar os caminhos no banco. Rodar no SQL Editor do Supabase
-- DEPOIS de 0001_initial.sql + seed.sql (seguro rodar mais de uma vez).

-- ── Capas e imagens de hover ─────────────────────────────────────────

update projects set
  cover_image_url = '/projects/100vezesmaxim/capa.webp',
  cover_image_alt = 'Peça-chave da campanha #100vezesMaxim para a Toalha de Papel Maxim (Sepac).',
  hover_image_url = '/projects/100vezesmaxim/hover.webp',
  hover_image_alt = 'Peça da campanha #100vezesMaxim com os diferentes usos da toalha de papel.'
where slug = '100vezesmaxim';

update projects set
  cover_image_url = '/projects/jobs-prefeitura-curitiba/capa.webp',
  cover_image_alt = 'Peça de campanha da Prefeitura de Curitiba.',
  hover_image_url = '/projects/jobs-prefeitura-curitiba/hover.webp',
  hover_image_alt = 'Peça da campanha Aqui tem Zelo, da Prefeitura de Curitiba.'
where slug = 'jobs-prefeitura-curitiba';

update projects set
  cover_image_url = '/projects/detran-seguranca-no-transito/capa.webp',
  cover_image_alt = 'Peça da campanha Semana Nacional de Trânsito do DETRAN.',
  hover_image_url = '/projects/detran-seguranca-no-transito/hover.webp',
  hover_image_alt = 'Peça da campanha Semana Nacional de Trânsito do DETRAN.'
where slug = 'detran-seguranca-no-transito';

update projects set
  cover_image_url = '/projects/insight-campanha-contra-racismo/capa.webp',
  cover_image_alt = 'Peça da campanha para o Dia Nacional da Consciência Negra.',
  hover_image_url = '/projects/insight-campanha-contra-racismo/hover.webp',
  hover_image_alt = 'Peça da campanha para o Dia Nacional da Consciência Negra.'
where slug = 'insight-campanha-contra-racismo';

update projects set
  cover_image_url = '/projects/campanha-black-friday/capa.webp',
  cover_image_alt = 'Peça da campanha Black Friday da Oriba.',
  hover_image_url = '/projects/campanha-black-friday/hover.webp',
  hover_image_alt = 'Peça da campanha Transparent Friday da Oriba.'
where slug = 'campanha-black-friday';

update projects set
  cover_image_url = '/projects/cartazes-outubro-rosa/capa.webp',
  cover_image_alt = 'Cartaz da série Ditados que Salvam, de conscientização do Outubro Rosa.',
  hover_image_url = '/projects/cartazes-outubro-rosa/hover.webp',
  hover_image_alt = 'Cartaz da série Ditados que Salvam, de conscientização do Outubro Rosa.'
where slug = 'cartazes-outubro-rosa';

-- ── Galerias (substitui as antigas por completo) ─────────────────────

delete from project_gallery_images
where project_id in (select id from projects where slug in (
  '100vezesmaxim',
  'jobs-prefeitura-curitiba',
  'detran-seguranca-no-transito',
  'insight-campanha-contra-racismo',
  'campanha-black-friday',
  'cartazes-outubro-rosa'
));

insert into project_gallery_images (project_id, image_url, alt_text, display_order)
select p.id, g.image_url, g.alt_text, g.display_order
from projects p
join lateral (
  values
    ('/projects/100vezesmaxim/galeria-1.webp', 'Key visual da campanha #100vezesMaxim.', 1),
    ('/projects/100vezesmaxim/galeria-2.webp', 'Peça da ativação com 100 influenciadores mostrando usos da Toalha Maxim.', 2)
) as g(image_url, alt_text, display_order) on true
where p.slug = '100vezesmaxim';

insert into project_gallery_images (project_id, image_url, alt_text, display_order)
select p.id, g.image_url, g.alt_text, g.display_order
from projects p
join lateral (
  values
    ('/projects/jobs-prefeitura-curitiba/galeria-1.webp', 'Peça da campanha Aqui tem Zelo, da Prefeitura de Curitiba.', 1),
    ('/projects/jobs-prefeitura-curitiba/galeria-2.webp', 'Peça do Programa Curitiba Mais Mulheres, com naming assinado pela Natália.', 2)
) as g(image_url, alt_text, display_order) on true
where p.slug = 'jobs-prefeitura-curitiba';

insert into project_gallery_images (project_id, image_url, alt_text, display_order)
select p.id, g.image_url, g.alt_text, g.display_order
from projects p
join lateral (
  values
    ('/projects/detran-seguranca-no-transito/galeria-1.webp', 'Peça 01 da campanha Semana Nacional de Trânsito do DETRAN.', 1),
    ('/projects/detran-seguranca-no-transito/galeria-2.webp', 'Peça 02 da campanha Semana Nacional de Trânsito do DETRAN.', 2),
    ('/projects/detran-seguranca-no-transito/galeria-3.webp', 'Peça 03 da campanha Semana Nacional de Trânsito do DETRAN.', 3),
    ('/projects/detran-seguranca-no-transito/galeria-4.webp', 'Peça 04 da campanha Semana Nacional de Trânsito do DETRAN.', 4),
    ('/projects/detran-seguranca-no-transito/galeria-5.webp', 'Peça 05 da campanha Semana Nacional de Trânsito do DETRAN.', 5),
    ('/projects/detran-seguranca-no-transito/galeria-6.webp', 'Peça 06 da campanha Semana Nacional de Trânsito do DETRAN.', 6)
) as g(image_url, alt_text, display_order) on true
where p.slug = 'detran-seguranca-no-transito';

insert into project_gallery_images (project_id, image_url, alt_text, display_order)
select p.id, g.image_url, g.alt_text, g.display_order
from projects p
join lateral (
  values
    ('/projects/insight-campanha-contra-racismo/galeria-1.webp', 'Peça 01 da campanha para o Dia Nacional da Consciência Negra.', 1),
    ('/projects/insight-campanha-contra-racismo/galeria-2.webp', 'Peça 02 da campanha para o Dia Nacional da Consciência Negra.', 2),
    ('/projects/insight-campanha-contra-racismo/galeria-3.webp', 'Peça 03 da campanha para o Dia Nacional da Consciência Negra.', 3),
    ('/projects/insight-campanha-contra-racismo/galeria-4.webp', 'Peça 04 da campanha para o Dia Nacional da Consciência Negra.', 4),
    ('/projects/insight-campanha-contra-racismo/galeria-5.webp', 'Peça 05 da campanha para o Dia Nacional da Consciência Negra.', 5),
    ('/projects/insight-campanha-contra-racismo/galeria-6.webp', 'Peça 06 da campanha para o Dia Nacional da Consciência Negra.', 6),
    ('/projects/insight-campanha-contra-racismo/galeria-7.webp', 'Peça 07 da campanha para o Dia Nacional da Consciência Negra.', 7),
    ('/projects/insight-campanha-contra-racismo/galeria-8.webp', 'Peça 08 da campanha para o Dia Nacional da Consciência Negra.', 8),
    ('/projects/insight-campanha-contra-racismo/galeria-9.webp', 'Peça 09 da campanha para o Dia Nacional da Consciência Negra.', 9),
    ('/projects/insight-campanha-contra-racismo/galeria-10.webp', 'Peça 10 da campanha para o Dia Nacional da Consciência Negra.', 10)
) as g(image_url, alt_text, display_order) on true
where p.slug = 'insight-campanha-contra-racismo';

insert into project_gallery_images (project_id, image_url, alt_text, display_order)
select p.id, g.image_url, g.alt_text, g.display_order
from projects p
join lateral (
  values
    ('/projects/campanha-black-friday/galeria-1.webp', 'Peça 01 da campanha Black Friday da Oriba.', 1),
    ('/projects/campanha-black-friday/galeria-2.webp', 'Peça 02 da campanha Black Friday da Oriba.', 2),
    ('/projects/campanha-black-friday/galeria-3.webp', 'Peça 03 da campanha Black Friday da Oriba.', 3),
    ('/projects/campanha-black-friday/galeria-4.webp', 'Peça 04 da campanha Black Friday da Oriba.', 4),
    ('/projects/campanha-black-friday/galeria-5.webp', 'Peça 05 da campanha Black Friday da Oriba.', 5),
    ('/projects/campanha-black-friday/galeria-6.webp', 'Peça 06 da campanha Transparent Friday da Oriba.', 6),
    ('/projects/campanha-black-friday/galeria-7.webp', 'Peça 07 da campanha Black Friday da Oriba.', 7)
) as g(image_url, alt_text, display_order) on true
where p.slug = 'campanha-black-friday';

insert into project_gallery_images (project_id, image_url, alt_text, display_order)
select p.id, g.image_url, g.alt_text, g.display_order
from projects p
join lateral (
  values
    ('/projects/cartazes-outubro-rosa/galeria-1.webp', 'Cartaz 01 da série Ditados que Salvam (Outubro Rosa).', 1),
    ('/projects/cartazes-outubro-rosa/galeria-2.webp', 'Cartaz 02 da série Ditados que Salvam (Outubro Rosa).', 2),
    ('/projects/cartazes-outubro-rosa/galeria-3.webp', 'Cartaz 03 da série Ditados que Salvam (Outubro Rosa).', 3),
    ('/projects/cartazes-outubro-rosa/galeria-4.webp', 'Cartaz 04 da série Ditados que Salvam (Outubro Rosa).', 4),
    ('/projects/cartazes-outubro-rosa/galeria-5.webp', 'Cartaz 05 da série Ditados que Salvam (Outubro Rosa).', 5)
) as g(image_url, alt_text, display_order) on true
where p.slug = 'cartazes-outubro-rosa';

-- Bônus: corrige o LinkedIn (o seed antigo tinha um link de palpite).
update about set linkedin_url = 'https://www.linkedin.com/in/natalia-machado-gumerato/';
