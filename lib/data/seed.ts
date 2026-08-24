import type { About, Client, Project, ProjectSection } from "@/lib/types";

/**
 * Conteúdo seed local — usado como fallback enquanto o Supabase real da
 * Natália não está conectado (ver lib/data/*.ts). Também é a base para
 * supabase/seed.sql, que popula o banco real quando ela criar a conta.
 */

const now = "2026-01-01T00:00:00.000Z";

/** Seções de texto de um case, na ordem dada (título editável + corpo). */
function caseSections(
  projectId: string,
  texts: Array<[title: string, body: string]>
): ProjectSection[] {
  return texts.map(([title, body], i) => ({
    id: `${projectId}-s${i + 1}`,
    project_id: projectId,
    kind: "text" as const,
    title,
    body,
    url: "",
    image_alt: "",
    layout: "contained" as const,
    align: "center" as const,
    position: "50% 50%",
    aspect: "" as const,
    items: [],
    display_order: i + 1,
  }));
}

export const seedProjects: Project[] = [
  {
    id: "seed-100vezesmaxim",
    title: "#100vezesMaxim",
    slug: "100vezesmaxim",
    category: "Campanha autoral",
    year: 2022,
    client: "Projeto autoral",
    award: "Top of Marketing ADVB/PR",
    cover_image_url: "/projects/100vezesmaxim/capa.webp",
    cover_image_alt: "Peça-chave da campanha #100vezesMaxim para a Toalha de Papel Maxim (Sepac).",
    cover_image_position: "50% 50%",
    hover_image_url: "/projects/100vezesmaxim/hover.webp",
    hover_image_alt: "Peça da campanha #100vezesMaxim com os diferentes usos da toalha de papel.",
    hover_image_position: "50% 50%",
    sections: caseSections("seed-100vezesmaxim", [
      [
        "Contexto do cliente",
        "O #100vezesMaxim nasceu sem briefing de cliente — nasceu de uma inquietação minha: será que eu consigo sustentar ideia boa todo santo dia, sem depender de inspiração de vez em quando? Decidi testar isso na prática, em público, com prazo curto e sem margem pra enrolar.",
      ],
      [
        "O desafio",
        "O desafio não era escrever um texto bom. Era escrever cem — em sequência, sem repetir caminho, sem cair no piloto automático depois do décimo dia. Provar repertório e resistência criativa ao mesmo tempo, com a mesma exigência do primeiro ao último.",
      ],
      [
        "A solução criativa",
        "Criei uma rotina de produção diária: um conceito, um formato, uma peça — publicada, sem revisão de comitê, sem rede de segurança. Cada entrega precisava se sustentar sozinha e, juntas, formar um portfólio de raciocínio rápido sob pressão real.",
      ],
      [
        "O resultado",
        "O projeto foi reconhecido com o prêmio Top of Marketing da ADVB/PR — hoje é o case que mais abre porta em processo seletivo de agência, porque mostra volume, consistência e repertório num intervalo de tempo curto.",
      ],
    ]),
    status: "published",
    display_order: 1,
    gallery: [
      {
        id: "seed-100vezesmaxim-g1",
        project_id: "seed-100vezesmaxim",
        image_url: "/projects/100vezesmaxim/galeria-1.webp",
        alt_text: "Key visual da campanha #100vezesMaxim.",
        position: "50% 50%",
        display_order: 1,
      },
      {
        id: "seed-100vezesmaxim-g2",
        project_id: "seed-100vezesmaxim",
        image_url: "/projects/100vezesmaxim/galeria-2.webp",
        alt_text: "Peça da ativação com 100 influenciadores mostrando usos da Toalha Maxim.",
        position: "50% 50%",
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
    cover_image_url: "/projects/jobs-prefeitura-curitiba/capa.webp",
    cover_image_alt: "Peça de campanha da Prefeitura de Curitiba.",
    cover_image_position: "50% 50%",
    hover_image_url: "/projects/jobs-prefeitura-curitiba/hover.webp",
    hover_image_alt: "Peça da campanha Aqui tem Zelo, da Prefeitura de Curitiba.",
    hover_image_position: "50% 50%",
    sections: caseSections("seed-jobs-prefeitura-curitiba", [
      [
        "Contexto do cliente",
        "A Prefeitura de Curitiba abre vagas o ano inteiro — de operacional a cargo técnico — mas a comunicação dessas oportunidades vivia presa em edital, PDF e linguagem de concurso público. Quem precisava do emprego simplesmente não lia até o fim.",
      ],
      [
        "O desafio",
        "Transformar processo seletivo público em conteúdo que o curitibano de verdade parasse pra ler, sem perder a formalidade exigida por órgão público nem virar peça de recrutamento genérica de mercado privado.",
      ],
      [
        "A solução criativa",
        'Criei uma linha editorial que falava direto com quem precisa da vaga — linguagem simples, foco no benefício concreto pro candidato, formato pensado pra rede social e não pra mural. Menos "edital", mais "essa vaga é sua".',
      ],
      [
        "O resultado",
        "Mais candidatos chegando até o fim do processo seletivo e mais engajamento nos canais oficiais da prefeitura — prova de que comunicação pública também pode (e deve) ser direta.",
      ],
    ]),
    status: "published",
    display_order: 2,
    gallery: [
      {
        id: "seed-jobs-g1",
        project_id: "seed-jobs-prefeitura-curitiba",
        image_url: "/projects/jobs-prefeitura-curitiba/galeria-1.webp",
        alt_text: "Peça da campanha Aqui tem Zelo, da Prefeitura de Curitiba.",
        position: "50% 50%",
        display_order: 1,
      },
      {
        id: "seed-jobs-g2",
        project_id: "seed-jobs-prefeitura-curitiba",
        image_url: "/projects/jobs-prefeitura-curitiba/galeria-2.webp",
        alt_text: "Peça do Programa Curitiba Mais Mulheres, com naming assinado pela Natália.",
        position: "50% 50%",
        display_order: 2,
      },
    ],
    created_at: now,
    updated_at: now,
  },
  {
    // Case novo pedido no doc de ajustes — entra como rascunho, com capa
    // placeholder, pra Natália preencher conteúdo/artes no admin e publicar.
    id: "seed-aba-crm-unilever",
    title: "Aba CRM Unilever",
    slug: "aba-crm-unilever",
    category: "CRM",
    year: 2023,
    client: "Unilever",
    award: null,
    cover_image_url: "/placeholders/aba-crm-unilever-capa.svg",
    cover_image_alt: "Capa provisória do case Aba CRM Unilever.",
    cover_image_position: "50% 50%",
    hover_image_url: null,
    hover_image_alt: null,
    hover_image_position: "50% 50%",
    sections: [],
    status: "draft",
    display_order: 3,
    gallery: [],
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-campanha-black-friday",
    title: "Black Friday Oriba",
    slug: "campanha-black-friday",
    category: "Campanha",
    year: 2021,
    client: "Oriba",
    award: null,
    cover_image_url: "/projects/campanha-black-friday/capa.webp",
    cover_image_alt: "Peça da campanha Black Friday da Oriba.",
    cover_image_position: "50% 50%",
    hover_image_url: "/projects/campanha-black-friday/hover.webp",
    hover_image_alt: "Peça da campanha Transparent Friday da Oriba.",
    hover_image_position: "50% 50%",
    sections: caseSections("seed-campanha-black-friday", [
      [
        "Contexto do cliente",
        'Cliente de varejo pedindo campanha de Black Friday — a data mais disputada do calendário publicitário, onde toda concorrente grita "desconto" ao mesmo tempo, no mesmo tom, com a mesma urgência artificial.',
      ],
      [
        "O desafio",
        "Ser ouvida numa data em que todo mundo compete pelo mesmo segundo de atenção com o mesmo argumento (preço), sem verba para brigar por espaço de mídia com os grandes.",
      ],
      [
        "A solução criativa",
        "Em vez de gritar desconto mais alto, mudei o ângulo: a campanha assumiu um tom de humor direto sobre o próprio exagero da data, criando identificação em vez de disputar decibéis com concorrente maior.",
      ],
      [
        "O resultado",
        "Campanha se destacou no feed do cliente em meio ao ruído sazonal típico da data, com peças compartilhadas organicamente — resultado difícil de comprar só com verba de mídia.",
      ],
    ]),
    status: "published",
    display_order: 4,
    gallery: Array.from({ length: 7 }, (_, i) => ({
      id: `seed-bf-g${i + 1}`,
      project_id: "seed-campanha-black-friday",
      image_url: `/projects/campanha-black-friday/galeria-${i + 1}.webp`,
      alt_text: `Peça ${String(i + 1).padStart(2, "0")} da campanha Black Friday da Oriba.`,
      position: "50% 50%",
      display_order: i + 1,
    })),
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
    cover_image_url: "/projects/detran-seguranca-no-transito/capa.webp",
    cover_image_alt: "Peça da campanha Semana Nacional de Trânsito do DETRAN.",
    cover_image_position: "50% 50%",
    hover_image_url: "/projects/detran-seguranca-no-transito/hover.webp",
    hover_image_alt: "Peça da campanha Semana Nacional de Trânsito do DETRAN.",
    hover_image_position: "50% 50%",
    sections: caseSections("seed-detran-seguranca-no-transito", [
      [
        "Contexto do cliente",
        "O DETRAN precisava de uma campanha de conscientização no trânsito que não fosse mais uma peça de estatística assustadora ignorada no feed — o público já tinha visto (e ignorado) esse tipo de comunicação centenas de vezes.",
      ],
      [
        "O desafio",
        "Fazer o motorista prestar atenção de novo num assunto sobre o qual ele já acha que sabe tudo, sem apelar para choque gratuito nem culpa vazia.",
      ],
      [
        "A solução criativa",
        "Troquei o número frio pela cena reconhecível: situações cotidianas de trânsito contadas do ponto de vista de quem quase perdeu alguém, aproximando o risco estatístico da experiência real de quem dirige em Curitiba.",
      ],
      [
        "O resultado",
        "Campanha ampliou o alcance da mensagem de segurança no trânsito nos canais do órgão, reforçando a comunicação institucional do DETRAN-PR como referência de tom mais humano no setor público.",
      ],
    ]),
    status: "published",
    display_order: 5,
    gallery: Array.from({ length: 6 }, (_, i) => ({
      id: `seed-detran-g${i + 1}`,
      project_id: "seed-detran-seguranca-no-transito",
      image_url: `/projects/detran-seguranca-no-transito/galeria-${i + 1}.webp`,
      alt_text: `Peça ${String(i + 1).padStart(2, "0")} da campanha Semana Nacional de Trânsito do DETRAN.`,
      position: "50% 50%",
      display_order: i + 1,
    })),
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-cartazes-outubro-rosa",
    title: "Ditados que Salvam",
    slug: "cartazes-outubro-rosa",
    category: "Cartazes",
    year: 2019,
    client: null,
    award: null,
    cover_image_url: "/projects/cartazes-outubro-rosa/capa.webp",
    cover_image_alt: "Cartaz da série Ditados que Salvam, de conscientização do Outubro Rosa.",
    cover_image_position: "50% 50%",
    hover_image_url: "/projects/cartazes-outubro-rosa/hover.webp",
    hover_image_alt: "Cartaz da série Ditados que Salvam, de conscientização do Outubro Rosa.",
    hover_image_position: "50% 50%",
    sections: caseSections("seed-cartazes-outubro-rosa", [
      [
        "Contexto do cliente",
        "Campanha interna de conscientização para o Outubro Rosa, pensada para circular em ambiente corporativo — mural, intranet, comunicação impressa — onde a mensagem de prevenção precisa competir com o volume normal de aviso de RH.",
      ],
      [
        "O desafio",
        "Falar de prevenção ao câncer de mama sem cair no cartaz genérico de laço rosa que todo mundo já aprendeu a ignorar em outubro.",
      ],
      [
        "A solução criativa",
        "Uma série de cartazes com texto curto e direto, cada um focado numa atitude prática de prevenção — não em estatística de medo, mas em ação que a pessoa consegue tomar naquele mesmo dia.",
      ],
      [
        "O resultado",
        "Série adotada como padrão de comunicação interna para a campanha, com boa lembrança entre colaboradores nos anos seguintes — sinal de que cartaz direto funciona melhor que cartaz bonito e vazio.",
      ],
    ]),
    status: "published",
    display_order: 6,
    gallery: Array.from({ length: 5 }, (_, i) => ({
      id: `seed-outubro-g${i + 1}`,
      project_id: "seed-cartazes-outubro-rosa",
      image_url: `/projects/cartazes-outubro-rosa/galeria-${i + 1}.webp`,
      alt_text: `Cartaz ${String(i + 1).padStart(2, "0")} da série Ditados que Salvam (Outubro Rosa).`,
      position: "50% 50%",
      display_order: i + 1,
    })),
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
    cover_image_url: "/projects/insight-campanha-contra-racismo/capa.webp",
    cover_image_alt: "Peça da campanha para o Dia Nacional da Consciência Negra.",
    cover_image_position: "50% 50%",
    hover_image_url: "/projects/insight-campanha-contra-racismo/hover.webp",
    hover_image_alt: "Peça da campanha para o Dia Nacional da Consciência Negra.",
    hover_image_position: "50% 50%",
    sections: caseSections("seed-insight-campanha-contra-racismo", [
      [
        "Contexto do cliente",
        "Marcas estavam (e ainda estão) publicando post de apoio antirracista todo mês de novembro e esquecendo do assunto no resto do ano. O briefing pedia uma campanha institucional que não caísse nesse lugar comum.",
      ],
      [
        "O desafio",
        "Dizer algo sobre racismo que não fosse discurso pronto — sem citação genérica, sem imagem de banco de dados, sem parecer só mais uma marca tentando marcar posição por marcar.",
      ],
      [
        "A solução criativa",
        "Parti de um insight simples e desconfortável: racismo não é só ato explícito, é também o que a sociedade normaliza caladamente. A campanha usou isso como fio condutor — texto direto, sem eufemismo, tratando o tema com o peso que ele exige.",
      ],
      [
        "O resultado",
        "Repercussão orgânica acima do esperado para uma campanha institucional sem grande verba de mídia — prova de que insight verdadeiro viaja mais longe do que orçamento de impulsionamento.",
      ],
    ]),
    status: "published",
    display_order: 7,
    gallery: Array.from({ length: 10 }, (_, i) => ({
      id: `seed-insight-g${i + 1}`,
      project_id: "seed-insight-campanha-contra-racismo",
      image_url: `/projects/insight-campanha-contra-racismo/galeria-${i + 1}.webp`,
      alt_text: `Peça ${String(i + 1).padStart(2, "0")} da campanha para o Dia Nacional da Consciência Negra.`,
      position: "50% 50%",
      display_order: i + 1,
    })),
    created_at: now,
    updated_at: now,
  },
];

export const seedAbout: About = {
  id: "seed-about",
  photo_url: "/placeholders/natalia-sobre.svg",
  photo_alt: "Retrato ilustrativo de Natália Machado.",
  photo_position: "50% 50%",
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

/**
 * Logos de clientes/marcas — vitrine "Pra quem já escrevi" na Home (ver
 * components/sections/client-marquee.tsx). Ordem 1–22 é a mesma do site
 * antigo. Arquivos em public/clients/*.png (mesmo padrão do
 * public/placeholders usado pelos projetos: caminho local, sem depender do
 * Supabase Storage).
 */
const CLIENT_NAMES: Array<[name: string, file: string]> = [
  ["Above", "above"],
  ["Unilever", "unilever"],
  ["Electrolux", "electrolux"],
  ["Ademicon", "ademicon"],
  ["Eurofarma", "eurofarma"],
  ["BeautyColor", "beautycolor"],
  ["MSD Saúde Animal", "msd-saude-animal"],
  ["Beneficência Portuguesa", "beneficencia-portuguesa"],
  ["Suzano", "suzano"],
  ["Coamo", "coamo"],
  ["Sanepar", "sanepar"],
  ["Grupo Muffato", "grupo-muffato"],
  ["Prefeitura de Curitiba", "prefeitura-de-curitiba"],
  ["Sepac", "sepac"],
  ["Daju", "daju"],
  ["Compagas", "compagas"],
  ["Grupo Barigüi", "grupo-barigui"],
  ["GT.Home ABC", "gt-home-abc"],
  ["Minipreço", "minipreco"],
  ["Pátio Batel", "patio-batel"],
  ["Ser Educacional", "ser-educacional"],
  ["Sonner", "sonner"],
];

export const seedClients: Client[] = CLIENT_NAMES.map(([name, file], index) => ({
  id: `seed-client-${file}`,
  name,
  logo_url: `/clients/${file}.png`,
  // "Grupo X" pede artigo masculino ("Logo do Grupo Muffato"); demais nomes
  // de marca usam o feminino genérico ("Logo da Unilever").
  logo_alt: `Logo d${name.startsWith("Grupo") ? "o" : "a"} ${name}`,
  display_order: index + 1,
  created_at: now,
  updated_at: now,
}));
