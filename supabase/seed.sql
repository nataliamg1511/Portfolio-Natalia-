-- Conteúdo inicial (seed) — espelha lib/data/seed.ts.
-- Rode depois da migration 0001_initial.sql. Substitua as imagens em
-- /placeholders pelas peças reais pelo próprio /admin quando quiser.

-- ────────────────────────────────────────────────────────────────────────
-- about (singleton)
-- ────────────────────────────────────────────────────────────────────────
insert into public.about (
  photo_url, photo_alt, bio_main_text, bio_secondary_text, clients, tools,
  resume_url, linkedin_url, email, whatsapp_number
) values (
  '/placeholders/natalia-sobre.svg',
  'Retrato ilustrativo de Natália Machado.',
  E'Oi, eu sou a Natália Machado — redatora publicitária, mineira de nascimento e curitibana de adoção. Gosto de falar, mas sei ouvir — e é ouvir que me ajuda a escrever textos que resolvem problema de verdade, não só que enchem linha bonita.\n\nNão acho a zona de conforto confortável. Sou determinada demais para ficar parada esperando a oportunidade perfeita: fui atrás de agência, de prefeitura, de prêmio de mercado — e sigo atrás do próximo case que me tire do lugar.\n\nHoje assino campanhas para contas grandes, penso estratégia antes de escrever a primeira palavra e devolvo pro cliente aquilo que ele nem sabia que precisava ouvir.',
  E'Antes de vestir a camisa de redatora, eu já era uma. Guardo lembrança nítida de decorar comerciais de TV na infância — palavra por palavra, trilha e tudo — e de escrever "filmes" inteiros para as minhas bonecas, com roteiro, personagem e final garantido.\n\nFoi ali, sem saber o nome disso, que encontrei o amor da minha vida: a escrita. De lá pra cá, viraram anos organizando ideia em frase, transformando briefing em texto que convence, emociona e vende. Continua sendo a parte que mais gosto de fazer — só que agora tem cliente, prazo e resultado pra provar.',
  '["Prefeitura de Curitiba", "DETRAN-PR", "Campanhas institucionais de grande alcance", "Varejo"]'::jsonb,
  '["ChatGPT", "Gemini", "Claude", "Perplexity", "Grok", "Trello", "Notion", "Publi Manager"]'::jsonb,
  '',
  'https://www.linkedin.com/in/natalia-machado-gumerato/',
  'nataliamg.1511@gmail.com',
  '5541985324358'
)
on conflict do nothing;

-- ────────────────────────────────────────────────────────────────────────
-- projects
-- ────────────────────────────────────────────────────────────────────────
insert into public.projects (
  title, slug, category, year, client, award,
  cover_image_url, cover_image_alt, hover_image_url, hover_image_alt,
  context_text, challenge_text, solution_text, result_text,
  status, display_order
) values
(
  '#100vezesMaxim', '100vezesmaxim', 'Campanha autoral', 2022, 'Projeto autoral', 'Top of Marketing ADVB/PR',
  '/placeholders/100vezesmaxim-capa.svg', 'Capa do case #100vezesMaxim, tipografia sobre fundo papel com selo do prêmio ADVB/PR.',
  '/placeholders/100vezesmaxim-hover.svg', 'Segunda peça do case #100vezesMaxim.',
  'O #100vezesMaxim nasceu sem briefing de cliente — nasceu de uma inquietação minha: será que eu consigo sustentar ideia boa todo santo dia, sem depender de inspiração de vez em quando? Decidi testar isso na prática, em público, com prazo curto e sem margem pra enrolar.',
  'O desafio não era escrever um texto bom. Era escrever cem — em sequência, sem repetir caminho, sem cair no piloto automático depois do décimo dia. Provar repertório e resistência criativa ao mesmo tempo, com a mesma exigência do primeiro ao último.',
  'Criei uma rotina de produção diária: um conceito, um formato, uma peça — publicada, sem revisão de comitê, sem rede de segurança. Cada entrega precisava se sustentar sozinha e, juntas, formar um portfólio de raciocínio rápido sob pressão real.',
  'O projeto foi reconhecido com o prêmio Top of Marketing da ADVB/PR — hoje é o case que mais abre porta em processo seletivo de agência, porque mostra volume, consistência e repertório num intervalo de tempo curto.',
  'published', 1
),
(
  'Jobs Prefeitura de Curitiba', 'jobs-prefeitura-curitiba', 'Case institucional', 2021, 'Prefeitura de Curitiba', null,
  '/placeholders/jobs-prefeitura-curitiba-capa.svg', 'Capa do case Jobs Prefeitura de Curitiba.',
  '/placeholders/jobs-prefeitura-curitiba-hover.svg', 'Segunda peça do case Jobs Prefeitura de Curitiba.',
  'A Prefeitura de Curitiba abre vagas o ano inteiro — de operacional a cargo técnico — mas a comunicação dessas oportunidades vivia presa em edital, PDF e linguagem de concurso público. Quem precisava do emprego simplesmente não lia até o fim.',
  'Transformar processo seletivo público em conteúdo que o curitibano de verdade parasse pra ler, sem perder a formalidade exigida por órgão público nem virar peça de recrutamento genérica de mercado privado.',
  'Criei uma linha editorial que falava direto com quem precisa da vaga — linguagem simples, foco no benefício concreto pro candidato, formato pensado pra rede social e não pra mural. Menos "edital", mais "essa vaga é sua".',
  'Mais candidatos chegando até o fim do processo seletivo e mais engajamento nos canais oficiais da prefeitura — prova de que comunicação pública também pode (e deve) ser direta.',
  'published', 2
),
(
  'DETRAN Segurança no Trânsito', 'detran-seguranca-no-transito', 'Campanha institucional', 2020, 'DETRAN-PR', null,
  '/placeholders/detran-seguranca-no-transito-capa.svg', 'Capa da campanha DETRAN Segurança no Trânsito.',
  '/placeholders/detran-seguranca-no-transito-hover.svg', 'Segunda peça da campanha DETRAN Segurança no Trânsito.',
  'O DETRAN precisava de uma campanha de conscientização no trânsito que não fosse mais uma peça de estatística assustadora ignorada no feed — o público já tinha visto (e ignorado) esse tipo de comunicação centenas de vezes.',
  'Fazer o motorista prestar atenção de novo num assunto sobre o qual ele já acha que sabe tudo, sem apelar para choque gratuito nem culpa vazia.',
  'Troquei o número frio pela cena reconhecível: situações cotidianas de trânsito contadas do ponto de vista de quem quase perdeu alguém, aproximando o risco estatístico da experiência real de quem dirige em Curitiba.',
  'Campanha ampliou o alcance da mensagem de segurança no trânsito nos canais do órgão, reforçando a comunicação institucional do DETRAN-PR como referência de tom mais humano no setor público.',
  'published', 3
),
(
  'Insight — Campanha contra o Racismo', 'insight-campanha-contra-racismo', 'Campanha institucional', 2020, null, null,
  '/placeholders/insight-campanha-contra-racismo-capa.svg', 'Capa da campanha institucional Insight contra o racismo.',
  '/placeholders/insight-campanha-contra-racismo-hover.svg', 'Segunda peça da campanha Insight contra o racismo.',
  'Marcas estavam (e ainda estão) publicando post de apoio antirracista todo mês de novembro e esquecendo do assunto no resto do ano. O briefing pedia uma campanha institucional que não caísse nesse lugar comum.',
  'Dizer algo sobre racismo que não fosse discurso pronto — sem citação genérica, sem imagem de banco de dados, sem parecer só mais uma marca tentando marcar posição por marcar.',
  'Parti de um insight simples e desconfortável: racismo não é só ato explícito, é também o que a sociedade normaliza caladamente. A campanha usou isso como fio condutor — texto direto, sem eufemismo, tratando o tema com o peso que ele exige.',
  'Repercussão orgânica acima do esperado para uma campanha institucional sem grande verba de mídia — prova de que insight verdadeiro viaja mais longe do que orçamento de impulsionamento.',
  'published', 4
),
(
  'Campanha Black Friday', 'campanha-black-friday', 'Campanha', 2021, 'Varejo', null,
  '/placeholders/campanha-black-friday-capa.svg', 'Capa da Campanha Black Friday.',
  '/placeholders/campanha-black-friday-hover.svg', 'Segunda peça da Campanha Black Friday.',
  'Cliente de varejo pedindo campanha de Black Friday — a data mais disputada do calendário publicitário, onde toda concorrente grita "desconto" ao mesmo tempo, no mesmo tom, com a mesma urgência artificial.',
  'Ser ouvida numa data em que todo mundo compete pelo mesmo segundo de atenção com o mesmo argumento (preço), sem verba para brigar por espaço de mídia com os grandes.',
  'Em vez de gritar desconto mais alto, mudei o ângulo: a campanha assumiu um tom de humor direto sobre o próprio exagero da data, criando identificação em vez de disputar decibéis com concorrente maior.',
  'Campanha se destacou no feed do cliente em meio ao ruído sazonal típico da data, com peças compartilhadas organicamente — resultado difícil de comprar só com verba de mídia.',
  'published', 5
),
(
  'Cartazes Outubro Rosa', 'cartazes-outubro-rosa', 'Cartazes', 2019, null, null,
  '/placeholders/cartazes-outubro-rosa-capa.svg', 'Capa da série de cartazes Outubro Rosa.',
  '/placeholders/cartazes-outubro-rosa-hover.svg', 'Segunda peça da série de cartazes Outubro Rosa.',
  'Campanha interna de conscientização para o Outubro Rosa, pensada para circular em ambiente corporativo — mural, intranet, comunicação impressa — onde a mensagem de prevenção precisa competir com o volume normal de aviso de RH.',
  'Falar de prevenção ao câncer de mama sem cair no cartaz genérico de laço rosa que todo mundo já aprendeu a ignorar em outubro.',
  'Uma série de cartazes com texto curto e direto, cada um focado numa atitude prática de prevenção — não em estatística de medo, mas em ação que a pessoa consegue tomar naquele mesmo dia.',
  'Série adotada como padrão de comunicação interna para a campanha, com boa lembrança entre colaboradores nos anos seguintes — sinal de que cartaz direto funciona melhor que cartaz bonito e vazio.',
  'published', 6
)
on conflict (slug) do nothing;

-- ────────────────────────────────────────────────────────────────────────
-- project_gallery_images (2 peças por projeto)
-- ────────────────────────────────────────────────────────────────────────
insert into public.project_gallery_images (project_id, image_url, alt_text, display_order)
select p.id, g.image_url, g.alt_text, g.display_order
from public.projects p
join (
  values
    ('100vezesmaxim', '/placeholders/100vezesmaxim-galeria-1.svg', 'Peça 01 da série #100vezesMaxim.', 1),
    ('100vezesmaxim', '/placeholders/100vezesmaxim-galeria-2.svg', 'Peça 02 da série #100vezesMaxim.', 2),
    ('jobs-prefeitura-curitiba', '/placeholders/jobs-prefeitura-curitiba-galeria-1.svg', 'Peça 01 do case Jobs Prefeitura de Curitiba.', 1),
    ('jobs-prefeitura-curitiba', '/placeholders/jobs-prefeitura-curitiba-galeria-2.svg', 'Peça 02 do case Jobs Prefeitura de Curitiba.', 2),
    ('detran-seguranca-no-transito', '/placeholders/detran-seguranca-no-transito-galeria-1.svg', 'Peça 01 da campanha DETRAN Segurança no Trânsito.', 1),
    ('detran-seguranca-no-transito', '/placeholders/detran-seguranca-no-transito-galeria-2.svg', 'Peça 02 da campanha DETRAN Segurança no Trânsito.', 2),
    ('insight-campanha-contra-racismo', '/placeholders/insight-campanha-contra-racismo-galeria-1.svg', 'Peça 01 da campanha Insight contra o racismo.', 1),
    ('insight-campanha-contra-racismo', '/placeholders/insight-campanha-contra-racismo-galeria-2.svg', 'Peça 02 da campanha Insight contra o racismo.', 2),
    ('campanha-black-friday', '/placeholders/campanha-black-friday-galeria-1.svg', 'Peça 01 da Campanha Black Friday.', 1),
    ('campanha-black-friday', '/placeholders/campanha-black-friday-galeria-2.svg', 'Peça 02 da Campanha Black Friday.', 2),
    ('cartazes-outubro-rosa', '/placeholders/cartazes-outubro-rosa-galeria-1.svg', 'Peça 01 da série de cartazes Outubro Rosa.', 1),
    ('cartazes-outubro-rosa', '/placeholders/cartazes-outubro-rosa-galeria-2.svg', 'Peça 02 da série de cartazes Outubro Rosa.', 2)
) as g(slug, image_url, alt_text, display_order)
  on g.slug = p.slug
on conflict do nothing;
