import type { About, Project } from "@/lib/types";

/**
 * Conteúdo seed local — usado como fallback enquanto o Supabase real da
 * Natália não está conectado (ver lib/data/*.ts). Também é a base para
 * supabase/seed.sql, que popula o banco real quando ela criar a conta.
 */

const now = "2026-01-01T00:00:00.000Z";

export const seedProjects: Project[] = [
  {
    id: "seed-100vezesmaxim",
    title: "#100vezesMaxim",
    slug: "100vezesmaxim",
    category: "Campanha autoral",
    year: 2022,
    client: "Projeto autoral",
    award: "Top of Marketing ADVB/PR",
    cover_image_url: "/placeholders/100vezesmaxim-capa.svg",
    cover_image_alt: "Capa do case #100vezesMaxim, tipografia sobre fundo papel com selo do prêmio ADVB/PR.",
    hover_image_url: "/placeholders/100vezesmaxim-hover.svg",
    hover_image_alt: "Segunda peça do case #100vezesMaxim.",
    context_text:
      "O #100vezesMaxim nasceu sem briefing de cliente — nasceu de uma inquietação minha: será que eu consigo sustentar ideia boa todo santo dia, sem depender de inspiração de vez em quando? Decidi testar isso na prática, em público, com prazo curto e sem margem pra enrolar.",
    challenge_text:
      "O desafio não era escrever um texto bom. Era escrever cem — em sequência, sem repetir caminho, sem cair no piloto automático depois do décimo dia. Provar repertório e resistência criativa ao mesmo tempo, com a mesma exigência do primeiro ao último.",
    solution_text:
      "Criei uma rotina de produção diária: um conceito, um formato, uma peça — publicada, sem revisão de comitê, sem rede de segurança. Cada entrega precisava se sustentar sozinha e, juntas, formar um portfólio de raciocínio rápido sob pressão real.",
    result_text:
      "O projeto foi reconhecido com o prêmio Top of Marketing da ADVB/PR — hoje é o case que mais abre porta em processo seletivo de agência, porque mostra volume, consistência e repertório num intervalo de tempo curto.",
    status: "published",
    display_order: 1,
    gallery: [
      {
        id: "seed-100vezesmaxim-g1",
        project_id: "seed-100vezesmaxim",
        image_url: "/placeholders/100vezesmaxim-galeria-1.svg",
        alt_text: "Peça 01 da série #100vezesMaxim.",
        display_order: 1,
      },
      {
        id: "seed-100vezesmaxim-g2",
        project_id: "seed-100vezesmaxim",
        image_url: "/placeholders/100vezesmaxim-galeria-2.svg",
        alt_text: "Peça 02 da série #100vezesMaxim.",
        display_order: 2,
      },
    ],
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-jobs-prefeitura-curitiba",
    title: "Jobs Prefeitura de Curitiba",
    slug: "jobs-prefeitura-curitiba",
    category: "Case institucional",
    year: 2021,
    client: "Prefeitura de Curitiba",
    award: null,
    cover_image_url: "/placeholders/jobs-prefeitura-curitiba-capa.svg",
    cover_image_alt: "Capa do case Jobs Prefeitura de Curitiba.",
    hover_image_url: "/placeholders/jobs-prefeitura-curitiba-hover.svg",
    hover_image_alt: "Segunda peça do case Jobs Prefeitura de Curitiba.",
    context_text:
      "A Prefeitura de Curitiba abre vagas o ano inteiro — de operacional a cargo técnico — mas a comunicação dessas oportunidades vivia presa em edital, PDF e linguagem de concurso público. Quem precisava do emprego simplesmente não lia até o fim.",
    challenge_text:
      "Transformar processo seletivo público em conteúdo que o curitibano de verdade parasse pra ler, sem perder a formalidade exigida por órgão público nem virar peça de recrutamento genérica de mercado privado.",
    solution_text:
      "Criei uma linha editorial que falava direto com quem precisa da vaga — linguagem simples, foco no benefício concreto pro candidato, formato pensado pra rede social e não pra mural. Menos \"edital\", mais \"essa vaga é sua\".",
    result_text:
      "Mais candidatos chegando até o fim do processo seletivo e mais engajamento nos canais oficiais da prefeitura — prova de que comunicação pública também pode (e deve) ser direta.",
    status: "published",
    display_order: 2,
    gallery: [
      {
        id: "seed-jobs-g1",
        project_id: "seed-jobs-prefeitura-curitiba",
        image_url: "/placeholders/jobs-prefeitura-curitiba-galeria-1.svg",
        alt_text: "Peça 01 do case Jobs Prefeitura de Curitiba.",
        display_order: 1,
      },
      {
        id: "seed-jobs-g2",
        project_id: "seed-jobs-prefeitura-curitiba",
        image_url: "/placeholders/jobs-prefeitura-curitiba-galeria-2.svg",
        alt_text: "Peça 02 do case Jobs Prefeitura de Curitiba.",
        display_order: 2,
      },
    ],
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-detran-seguranca-no-transito",
    title: "DETRAN Segurança no Trânsito",
    slug: "detran-seguranca-no-transito",
    category: "Campanha institucional",
    year: 2020,
    client: "DETRAN-PR",
    award: null,
    cover_image_url: "/placeholders/detran-seguranca-no-transito-capa.svg",
    cover_image_alt: "Capa da campanha DETRAN Segurança no Trânsito.",
    hover_image_url: "/placeholders/detran-seguranca-no-transito-hover.svg",
    hover_image_alt: "Segunda peça da campanha DETRAN Segurança no Trânsito.",
    context_text:
      "O DETRAN precisava de uma campanha de conscientização no trânsito que não fosse mais uma peça de estatística assustadora ignorada no feed — o público já tinha visto (e ignorado) esse tipo de comunicação centenas de vezes.",
    challenge_text:
      "Fazer o motorista prestar atenção de novo num assunto sobre o qual ele já acha que sabe tudo, sem apelar para choque gratuito nem culpa vazia.",
    solution_text:
      "Troquei o número frio pela cena reconhecível: situações cotidianas de trânsito contadas do ponto de vista de quem quase perdeu alguém, aproximando o risco estatístico da experiência real de quem dirige em Curitiba.",
    result_text:
      "Campanha ampliou o alcance da mensagem de segurança no trânsito nos canais do órgão, reforçando a comunicação institucional do DETRAN-PR como referência de tom mais humano no setor público.",
    status: "published",
    display_order: 3,
    gallery: [
      {
        id: "seed-detran-g1",
        project_id: "seed-detran-seguranca-no-transito",
        image_url: "/placeholders/detran-seguranca-no-transito-galeria-1.svg",
        alt_text: "Peça 01 da campanha DETRAN Segurança no Trânsito.",
        display_order: 1,
      },
      {
        id: "seed-detran-g2",
        project_id: "seed-detran-seguranca-no-transito",
        image_url: "/placeholders/detran-seguranca-no-transito-galeria-2.svg",
        alt_text: "Peça 02 da campanha DETRAN Segurança no Trânsito.",
        display_order: 2,
      },
    ],
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-insight-campanha-contra-racismo",
    title: "Insight — Campanha contra o Racismo",
    slug: "insight-campanha-contra-racismo",
    category: "Campanha institucional",
    year: 2020,
    client: null,
    award: null,
    cover_image_url: "/placeholders/insight-campanha-contra-racismo-capa.svg",
    cover_image_alt: "Capa da campanha institucional Insight contra o racismo.",
    hover_image_url: "/placeholders/insight-campanha-contra-racismo-hover.svg",
    hover_image_alt: "Segunda peça da campanha Insight contra o racismo.",
    context_text:
      "Marcas estavam (e ainda estão) publicando post de apoio antirracista todo mês de novembro e esquecendo do assunto no resto do ano. O briefing pedia uma campanha institucional que não caísse nesse lugar comum.",
    challenge_text:
      "Dizer algo sobre racismo que não fosse discurso pronto — sem citação genérica, sem imagem de banco de dados, sem parecer só mais uma marca tentando marcar posição por marcar.",
    solution_text:
      "Parti de um insight simples e desconfortável: racismo não é só ato explícito, é também o que a sociedade normaliza caladamente. A campanha usou isso como fio condutor — texto direto, sem eufemismo, tratando o tema com o peso que ele exige.",
    result_text:
      "Repercussão orgânica acima do esperado para uma campanha institucional sem grande verba de mídia — prova de que insight verdadeiro viaja mais longe do que orçamento de impulsionamento.",
    status: "published",
    display_order: 4,
    gallery: [
      {
        id: "seed-insight-g1",
        project_id: "seed-insight-campanha-contra-racismo",
        image_url: "/placeholders/insight-campanha-contra-racismo-galeria-1.svg",
        alt_text: "Peça 01 da campanha Insight contra o racismo.",
        display_order: 1,
      },
      {
        id: "seed-insight-g2",
        project_id: "seed-insight-campanha-contra-racismo",
        image_url: "/placeholders/insight-campanha-contra-racismo-galeria-2.svg",
        alt_text: "Peça 02 da campanha Insight contra o racismo.",
        display_order: 2,
      },
    ],
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-campanha-black-friday",
    title: "Campanha Black Friday",
    slug: "campanha-black-friday",
    category: "Campanha",
    year: 2021,
    client: "Varejo",
    award: null,
    cover_image_url: "/placeholders/campanha-black-friday-capa.svg",
    cover_image_alt: "Capa da Campanha Black Friday.",
    hover_image_url: "/placeholders/campanha-black-friday-hover.svg",
    hover_image_alt: "Segunda peça da Campanha Black Friday.",
    context_text:
      "Cliente de varejo pedindo campanha de Black Friday — a data mais disputada do calendário publicitário, onde toda concorrente grita \"desconto\" ao mesmo tempo, no mesmo tom, com a mesma urgência artificial.",
    challenge_text:
      "Ser ouvida numa data em que todo mundo compete pelo mesmo segundo de atenção com o mesmo argumento (preço), sem verba para brigar por espaço de mídia com os grandes.",
    solution_text:
      "Em vez de gritar desconto mais alto, mudei o ângulo: a campanha assumiu um tom de humor direto sobre o próprio exagero da data, criando identificação em vez de disputar decibéis com concorrente maior.",
    result_text:
      "Campanha se destacou no feed do cliente em meio ao ruído sazonal típico da data, com peças compartilhadas organicamente — resultado difícil de comprar só com verba de mídia.",
    status: "published",
    display_order: 5,
    gallery: [
      {
        id: "seed-bf-g1",
        project_id: "seed-campanha-black-friday",
        image_url: "/placeholders/campanha-black-friday-galeria-1.svg",
        alt_text: "Peça 01 da Campanha Black Friday.",
        display_order: 1,
      },
      {
        id: "seed-bf-g2",
        project_id: "seed-campanha-black-friday",
        image_url: "/placeholders/campanha-black-friday-galeria-2.svg",
        alt_text: "Peça 02 da Campanha Black Friday.",
        display_order: 2,
      },
    ],
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-cartazes-outubro-rosa",
    title: "Cartazes Outubro Rosa",
    slug: "cartazes-outubro-rosa",
    category: "Cartazes",
    year: 2019,
    client: null,
    award: null,
    cover_image_url: "/placeholders/cartazes-outubro-rosa-capa.svg",
    cover_image_alt: "Capa da série de cartazes Outubro Rosa.",
    hover_image_url: "/placeholders/cartazes-outubro-rosa-hover.svg",
    hover_image_alt: "Segunda peça da série de cartazes Outubro Rosa.",
    context_text:
      "Campanha interna de conscientização para o Outubro Rosa, pensada para circular em ambiente corporativo — mural, intranet, comunicação impressa — onde a mensagem de prevenção precisa competir com o volume normal de aviso de RH.",
    challenge_text:
      "Falar de prevenção ao câncer de mama sem cair no cartaz genérico de laço rosa que todo mundo já aprendeu a ignorar em outubro.",
    solution_text:
      "Uma série de cartazes com texto curto e direto, cada um focado numa atitude prática de prevenção — não em estatística de medo, mas em ação que a pessoa consegue tomar naquele mesmo dia.",
    result_text:
      "Série adotada como padrão de comunicação interna para a campanha, com boa lembrança entre colaboradores nos anos seguintes — sinal de que cartaz direto funciona melhor que cartaz bonito e vazio.",
    status: "published",
    display_order: 6,
    gallery: [
      {
        id: "seed-outubro-g1",
        project_id: "seed-cartazes-outubro-rosa",
        image_url: "/placeholders/cartazes-outubro-rosa-galeria-1.svg",
        alt_text: "Peça 01 da série de cartazes Outubro Rosa.",
        display_order: 1,
      },
      {
        id: "seed-outubro-g2",
        project_id: "seed-cartazes-outubro-rosa",
        image_url: "/placeholders/cartazes-outubro-rosa-galeria-2.svg",
        alt_text: "Peça 02 da série de cartazes Outubro Rosa.",
        display_order: 2,
      },
    ],
    created_at: now,
    updated_at: now,
  },
];

export const seedAbout: About = {
  id: "seed-about",
  photo_url: "/placeholders/natalia-sobre.svg",
  photo_alt: "Retrato ilustrativo de Natália Machado.",
  bio_main_text:
    "Oi, eu sou a Natália Machado — redatora publicitária, mineira de nascimento e curitibana de adoção. Gosto de falar, mas sei ouvir — e é ouvir que me ajuda a escrever textos que resolvem problema de verdade, não só que enchem linha bonita.\n\nNão acho a zona de conforto confortável. Sou determinada demais para ficar parada esperando a oportunidade perfeita: fui atrás de agência, de prefeitura, de prêmio de mercado — e sigo atrás do próximo case que me tire do lugar.\n\nHoje assino campanhas para contas grandes, penso estratégia antes de escrever a primeira palavra e devolvo pro cliente aquilo que ele nem sabia que precisava ouvir.",
  bio_secondary_text:
    "Antes de vestir a camisa de redatora, eu já era uma. Guardo lembrança nítida de decorar comerciais de TV na infância — palavra por palavra, trilha e tudo — e de escrever \"filmes\" inteiros para as minhas bonecas, com roteiro, personagem e final garantido.\n\nFoi ali, sem saber o nome disso, que encontrei o amor da minha vida: a escrita. De lá pra cá, viraram anos organizando ideia em frase, transformando briefing em texto que convence, emociona e vende. Continua sendo a parte que mais gosto de fazer — só que agora tem cliente, prazo e resultado pra provar.",
  clients: [
    "Prefeitura de Curitiba",
    "DETRAN-PR",
    "Campanhas institucionais de grande alcance",
    "Varejo",
  ],
  tools: [
    "ChatGPT",
    "Gemini",
    "Claude",
    "Perplexity",
    "Grok",
    "Trello",
    "Notion",
    "Publi Manager",
  ],
  resume_url: "",
  linkedin_url: "https://www.linkedin.com/in/natalia-machado-gumerato/",
  email: "nataliamg.1511@gmail.com",
  whatsapp_number: "5541985324358",
  updated_at: now,
};
