# CLAUDE.md — Portfólio Natália Machado

Guia rápido do projeto para quem for mexer no código depois (humano ou agente).

## Stack

- **Next.js 15** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** (config CSS-first em `app/globals.css`, sem `tailwind.config.ts`)
- **shadcn/ui** (estilo "Nova", baseado em Radix UI) + **lucide-react**
- **framer-motion** — toda animação segue os tokens de `DESIGN_SYSTEM.md` seção 5
- **react-hook-form + zod** — validação de formulários (contato e admin)
- **@supabase/supabase-js + @supabase/ssr** — Auth, Database, Storage (opcional, ver abaixo)

## Comandos

```bash
npm run dev      # ambiente de desenvolvimento (http://localhost:3000)
npm run build    # build de produção — rode sempre antes de publicar
npm run start    # roda o build de produção localmente
npm run lint      # ESLint
npx shadcn@latest add [componente]   # adicionar novo componente shadcn/ui
```

## Estrutura

```
app/
├── page.tsx                     # Home (hero + grid de projetos)
├── template.tsx                 # fade de transição entre páginas
├── projetos/[slug]/page.tsx     # case individual
├── sobre/page.tsx
├── contato/
│   └── page.tsx                 # canais diretos (LinkedIn + e-mail), sem formulário
├── admin/
│   ├── page.tsx                 # login (fora do grupo (dashboard))
│   ├── login-form.tsx
│   ├── actions.ts                # login / logout / recuperação de senha
│   └── (dashboard)/              # grupo de rotas com nav do admin
│       ├── layout.tsx
│       ├── projetos/            # lista, novo, [id], form, server actions
│       ├── clientes/            # lista + form de logos (sem página de edição)
│       └── sobre/                # editar bio/foto/contatos
├── sitemap.ts / robots.ts
components/
├── layout/        # header, footer públicos
├── sections/       # hero, grid de projetos, vitrine de logos de clientes, card de projeto
├── motion/          # wrappers de framer-motion (fade-in, stagger, crossfade)
├── admin/            # nav do admin, banner de fallback, lista editável, seletor de posição de imagem
└── ui/                # shadcn/ui + marquee-along-svg-path, linkedin-icon
lib/
├── types.ts
├── data/            # camada de dados (projects, about, clients) — ver abaixo
├── supabase/         # clients (browser/server/middleware) + upload de imagem
└── validation/        # schemas zod (projeto, sobre, cliente)
supabase/
├── migrations/0001_initial.sql   # schema completo + RLS + bucket de storage
├── migrations/0002_imagens_reais.sql   # troca placeholders pelas peças reais
├── migrations/0003_clientes.sql   # tabela `clients` + RLS + as 22 logos (self-contained)
└── seed.sql                       # os 6 projetos reais + conteúdo de "Sobre"
public/placeholders/               # SVGs gerados localmente (capa/hover/galeria de cada projeto)
public/clients/                    # PNGs das 22 logos de clientes (vitrine da Home)
```

## Camada de dados com fallback (importante)

O Supabase real da Natália **ainda não existe** — ela vai criar a própria conta
gratuita depois. Por isso toda a camada em `lib/data/*.ts` funciona em dois
modos, decididos por `lib/supabase/is-configured.ts`:

- **Sem `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` preenchidas**
  (estado atual): o site público lê os dados de `lib/data/seed.ts` (os 6
  projetos reais + bio). O formulário de contato "funciona" (mostra sucesso),
  mas não persiste nada. `/admin/*` mostra um aviso "Conecte o Supabase para
  ativar o painel" e os formulários ficam só de pré-visualização (não há
  onde salvar).
- **Com as variáveis preenchidas**: tudo passa a usar o Postgres/Auth/Storage
  do Supabase de verdade — CRUD completo de projetos, upload de imagem,
  login, mensagens.

Isso significa que `npm run dev` já mostra o site completo hoje, sem
depender de nenhum backend configurado.

## Como conectar o Supabase real (quando a Natália criar a conta)

1. **Criar o projeto**: acesse [supabase.com](https://supabase.com), crie uma
   conta gratuita e um novo projeto (escolha uma região próxima, ex. São
   Paulo/`sa-east-1`).
2. **Rodar o schema**: no painel do Supabase, abra **SQL Editor** e execute,
   nesta ordem, o conteúdo de:
   - `supabase/migrations/0001_initial.sql` (tabelas, índices, RLS, bucket
     `project-images` no Storage)
   - `supabase/seed.sql` (os 6 projetos reais + conteúdo de "Sobre")
   - `supabase/migrations/0002_imagens_reais.sql` (troca os placeholders
     pelas peças reais das campanhas, servidas de `public/projects/`)
   - `supabase/migrations/0003_clientes.sql` (cria a tabela `clients` e já
     insere as 22 logos servidas de `public/clients/` — arquivo único, não
     precisa rodar nenhum seed separado para isso)
   - `supabase/migrations/0004_posicao_imagens.sql` (colunas de enquadramento
     `*_position` em `projects`, `project_gallery_images` e `about` — usadas
     pelo seletor de posição de imagem em `/admin/projetos` e `/admin/sobre`)
   - `supabase/migrations/0005_secoes_de_case.sql` (tabela `project_sections`
     — seções flexíveis do case com título editável, texto/vídeo/link; copia
     os quatro textos antigos como seções e esvazia as colunas legadas)
   - `supabase/migrations/0006_ajustes_projetos.sql` (nova ordem dos
     projetos, renomeações "Black Friday Oriba"/"Ditados que Salvam" e o case
     rascunho "Aba CRM Unilever")
   - `supabase/migrations/0007_blocos_de_case.sql` (blocos de case: tipo
     `image` em `project_sections` + colunas de layout/alinhamento/
     enquadramento; copia a galeria como blocos de imagem intercalados e
     mantém `project_gallery_images` só como fallback de leitura)
   - `supabase/migrations/0008_carrossel_e_orientacao.sql` (bloco `carousel`
     com itens em jsonb, orientação de vídeo `aspect` 16:9/9:16 e o tamanho
     `small` na caixa de largura dos blocos)
   - `supabase/migrations/0009_crop_livre.sql` (corte de livre escolha nas
     imagens do case: `aspect` aceita também 1:1/4:3/3:4; backfill de 4:3
     nas imagens que já tinham enquadramento personalizado)

   Alternativa via CLI (se tiver o Supabase CLI instalado):
   ```bash
   supabase link --project-ref <ref-do-projeto>
   supabase db push
   psql "<connection-string>" -f supabase/seed.sql
   ```
3. **Criar o usuário único do admin**: em **Authentication → Users → Add
   user**, crie o e-mail/senha da Natália manualmente (não existe
   autocadastro no site — é intencional).
4. **Pegar as chaves**: em **Project Settings → API**, copie a **Project URL**
   e a **anon public key**.
5. **Preencher `.env.local`** (na raiz do projeto):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   NEXT_PUBLIC_SITE_URL=https://nataliamachado.com.br
   ```
6. **Reiniciar** `npm run dev` (ou fazer novo deploy). A partir daqui,
   `/admin` aceita login de verdade e todo o CRUD passa a persistir no
   Supabase.
7. Em produção (Vercel, Netlify etc.), configure as mesmas variáveis de
   ambiente no painel do provedor de hosting.

## Pontos a revisar com a Natália depois de conectar o Supabase

- `about.resume_url` está vazio no seed — sem isso, o botão de currículo em
  `/sobre` fica escondido (mostra "Currículo em breve"). Preencher em
  `/admin/sobre`.
- `about.linkedin_url` no seed é um palpite (`linkedin.com/in/nataliamachado`)
  — confirmar/corrigir o link real em `/admin/sobre`.
- Os textos de case (contexto/desafio/solução/resultado) dos 6 projetos seed
  foram escritos com base nos nomes de campanha do briefing, mas vale a
  Natália revisar cada um e ajustar para o relato exato de cada case.
- Trocar as imagens placeholder (`public/placeholders/*.svg`) pelas peças
  reais via `/admin/projetos/[id]` (upload direto para o bucket
  `project-images`).
- Se o Supabase de produção já estiver conectado (variáveis preenchidas na
  Vercel), rode `supabase/migrations/0003_clientes.sql` no SQL Editor antes
  de usar `/admin/clientes` de verdade — sem a tabela `clients`, a vitrine
  "Pra quem já escrevi" na Home continua funcionando (cai no fallback local
  de `lib/data/seed.ts`, as mesmas 22 logos), mas o admin não salva nada.
- Mesma coisa para `supabase/migrations/0004_posicao_imagens.sql`: sem ela,
  a leitura do site público continua 100% normal (as colunas novas caem no
  fallback `"50% 50%"` em `lib/data/*.ts`), mas salvar um projeto ou a
  página `/sobre` no admin passa a falhar com erro de coluna inexistente —
  rode a migration antes de usar o seletor de posição de imagem.
- E para `supabase/migrations/0005_secoes_de_case.sql`: sem ela, o site
  público continua no ar (as seções do case são derivadas das colunas
  antigas `context/challenge/solution/result_text`), mas salvar um projeto
  no admin falha porque a tabela `project_sections` não existe — rode a
  migration antes de editar projetos.
- Idem `supabase/migrations/0007_blocos_de_case.sql`: sem ela o site público
  continua normal (a leitura deriva blocos de imagem da galeria antiga em
  memória, com os mesmos fallbacks de coluna), mas salvar um projeto no
  admin falha — o insert usa as colunas novas (`image_alt`/`layout`/`align`/
  `position`) e o tipo `image`. Rode a 0007 junto do deploy do código que a
  acompanha.
- Idem `supabase/migrations/0008_carrossel_e_orientacao.sql`: sem ela a
  leitura pública segue normal (`aspect`/`items` caem em fallback), mas
  salvar um projeto no admin falha — o insert usa `aspect`/`items` e os
  tipos/tamanhos novos (`carousel`, `small`). Rode a 0008 junto do deploy.
- Idem `supabase/migrations/0009_crop_livre.sql`: sem ela, salvar uma imagem
  com corte 1:1/4:3/3:4 falha no check de `aspect`. Rode a 0009 junto do
  deploy (ela também faz o backfill que mantém o visual dos cases antigos).
- O case "Aba CRM Unilever" entra como **rascunho** (sem conteúdo/artes) —
  a Natália preenche em `/admin/projetos` e publica quando tiver o material.
