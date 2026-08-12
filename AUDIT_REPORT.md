# Audit Report — 2026-08-11

Projeto: Portfolio Natalia Machado (Next.js 15 App Router, Tailwind v4, framer-motion, Supabase com fallback local).
Auditor: QA + Performance Auditor (Vibecoding Squad). Auditoria feita via leitura de codigo, `npm run build`/`npm run lint` e testes de HTTP -- sem Lighthouse (sem browser tool disponivel neste ambiente; ver secao 2).

---

## 0. Nota ambiental importante (leia antes do resto)

Durante a auditoria, rodei `npm run build` (necessario para medir bundle/first-load JS). O projeto nao usa `distDir` customizado, entao build de producao e o `next dev --turbopack` que ja estava rodando na porta 3000 compartilham a mesma pasta `.next`. Depois do build, o dev server em `http://localhost:3000` (e um segundo processo Next orfao ja ocupando a porta 3001, que nao foi criado por mim) passaram a responder HTTP 500 "Internal Server Error" em todas as rotas, inclusive `/robots.txt` e `/sitemap.xml`.

Isso nao e um bug de codigo -- o build de producao terminou 3x consecutivas com sucesso total (0 erros, 0 warnings, todas as 20 paginas geradas), e o lint esta 100% limpo. E um conflito de ambiente Windows (lock de arquivo entre `next dev` e `next build` usando a mesma `.next`). Nao derrubei nem reiniciei o processo ja em execucao (era a instrucao), mas ele ficou inutilizavel para navegacao manual/Lighthouse ate ser reiniciado.

Acao necessaria antes de testar no navegador ou rodar Lighthouse: pare o `npm run dev` atual (Ctrl+C no terminal onde ele roda) e rode `npm run dev` de novo.

---

## 1. Build & Bundle

Status: OK -- `npm run build` limpo (3 execucoes, incluindo a final pos-correcoes). OK -- `npm run lint` limpo, 0 erros, 0 warnings, 0 `any` injustificado (o unico `any` em `lib/data/projects.ts:228` tem `eslint-disable` comentado e justificado).

First Load JS por rota (build final, apos as correcoes desta auditoria):

| Rota | Tamanho da pagina | First Load JS | Tipo |
|---|---|---|---|
| `/` | 11.4 kB | 198 kB | Static |
| `/sobre` | 9.31 kB | 196 kB | Static |
| `/contato` | 88.4 kB | 275 kB | Static |
| `/projetos/[slug]` | 11 kB | 198 kB | SSG (6 slugs pre-renderados) |
| `/_not-found` | 0 B | 187 kB | Static |
| `/admin` | 4.81 kB | 192 kB | Static |
| `/admin/mensagens` | 17.5 kB | 208 kB | Static |
| `/admin/projetos` | 38.4 kB | 238 kB | Static |
| `/admin/projetos/[id]` | 0 B | 246 kB | Dynamic |
| `/admin/projetos/novo` | 0 B | 246 kB | Static |
| `/admin/sobre` | 4.06 kB | 242 kB | Static |
| `/robots.txt`, `/sitemap.xml` | 0 B | -- | Static |

First Load JS compartilhado por todas as rotas: 193 kB. Middleware: 67.3 kB.

Observacao de performance: `/contato` e a rota publica mais pesada (275 kB) por causa de `react-hook-form` + `@hookform/resolvers/zod` + `zod` no client bundle. Nao e um problema -- e o preco de validacao client-side robusta num formulario -- mas e o maior candidato a otimizacao futura (P2) se quiser reduzir ainda mais.

Paginas estaticas vs dinamicas: a maioria e estatica/SSG com `revalidate = 60` (ISR) nas rotas publicas (`/`, `/sobre`, `/contato`, cases). `/admin/projetos/[id]` e dinamica (correto, precisa ler o projeto especifico a cada acesso).

---

## 2. Lighthouse (rodar manualmente)

Nao pude rodar Lighthouse neste ambiente (sem ferramenta de browser). Acao pendente para o usuario: depois de reiniciar `npm run dev` (ver secao 0), rodar Lighthouse (Chrome DevTools, Lighthouse, modo Navegacao anonima, throttling mobile) nas rotas `/`, `/sobre`, `/contato`, `/projetos/100vezesmaxim` e colar aqui:
- Performance / Accessibility / Best Practices / SEO
- LCP / CLS / FID / INP
- Oportunidades principais

Com base na analise estatica de codigo, minha expectativa e Performance alta (poucas dependencias client-side pesadas, imagens com `next/image`, fontes com `next/font`) e Accessibility alta (apos as correcoes desta auditoria).

---

## 3. Acessibilidade (a11y)

- [x] OK -- Um unico `<h1>` por pagina -- confirmado em todas as rotas publicas e privadas.
- [x] OK -- Hierarquia de headings sem pulo -- era um problema real: `app/projetos/[slug]/page.tsx` tinha `h1 -> h4` nos blocos de conteudo (Contexto/Desafio/Solucao/Resultado) e `h1 -> h3` na navegacao anterior/proximo, pulando `h2`. Corrigido: ambos agora sao `h2` (mantendo as classes visuais originais, sem mudar design).
- [x] OK -- Alt text em todas as imagens -- `cover_image_alt`, `hover_image_alt`, `alt_text` de galeria e `photo_alt` do Sobre sao campos obrigatorios (zod min 1) e sempre passados ao `next/image`. Thumbnails puramente decorativos no admin (tabela de projetos, preview de galeria) usam `alt=""` corretamente, ja que o texto ao lado cobre a informacao.
- [x] OK -- Focus ring visivel -- todos os elementos interativos usam `focus-visible:ring-*` consistente (cards de projeto, links de navegacao entre cases, inputs, botoes shadcn).
- [x] OK -- Navegacao 100% por teclado -- cards sao `<Link>` reais (nao div+onClick), modais Radix (`Dialog`/`AlertDialog`) ja trazem focus trap e fecham com Esc nativamente.
- [x] OK -- Contraste AA -- calculei os ratios reais da paleta (ver abaixo). Todos os pares de texto usados passam AA (a maioria passa AAA).
- [x] OK -- Labels associados aos inputs -- `htmlFor`/`id` corretos no form de contato e nos forms do admin (`project-form.tsx`, `about-form.tsx`, `login-form.tsx`).
- [x] OK -- Botoes com so icone tem `aria-label` -- confirmado em `projects-table.tsx` (mover cima/baixo, mais acoes, excluir) e no botao de fechar do `Dialog` (sr-only "Close").
- [x] OK -- Modais usam `role="dialog"`, `aria-modal="true"` e trap focus -- herdado do Radix UI (`Dialog`/`AlertDialog`), nao precisa de implementacao manual.
- [x] OK -- `prefers-reduced-motion` respeitado -- duplamente coberto: cada componente de motion (`FadeIn`, `StaggerContainer/Item`, `CrossfadeImage`, `template.tsx`, `contact-form.tsx`, `site-footer.tsx`) chama `useReducedMotion()` do framer-motion, e existe uma rede de seguranca global em `globals.css` (`@media (prefers-reduced-motion: reduce)`) para transicoes CSS puras (sublinhado, seta, header no scroll).
- [x] OK -- Skip link -- estava ausente, corrigido. Adicionei um link "Pular para o conteudo" (sr-only, visivel so no focus) em `components/layout/site-header.tsx`, e `id="main-content"` no `<main>` de todas as 5 paginas publicas (`/`, `/sobre`, `/contato`, `/projetos/[slug]`, `not-found.tsx`).

### Contraste calculado (WCAG, formula oficial de luminancia relativa)

| Par | Ratio | AA texto normal (4.5:1) | AA UI/texto grande (3:1) |
|---|---|---|---|
| foreground sobre background | 15.94:1 | OK | OK |
| muted-foreground sobre background | 5.88:1 | OK | OK |
| accent (terracota) sobre background | 6.38:1 | OK | OK |
| destructive sobre background (erros) | 5.08:1 | OK | OK |
| foreground sobre secondary (badges) | 14.60:1 | OK | OK |

Nenhuma violacao de contraste encontrada nos pares de texto realmente usados. `border` sobre `background` fica em 1.29:1, mas isso e esperado/aceitavel -- e uma hairline decorativa, nao texto nem elemento de UI que precise indicar estado sozinho (o foco usa `--ring`, que e o accent, com 6.38:1).

### Pendencias de a11y (nao corrigidas, ver secao 9)
- Icones decorativos AlertCircle/CheckCircle2 dentro de `<Alert>` (cerca de 13 ocorrencias em `contact-form.tsx`, `login-form.tsx`, `about-form.tsx`, `project-form.tsx`, `fallback-banner.tsx`, `admin/page.tsx`) nao tem `aria-hidden="true"` explicito. Na pratica, SVGs do lucide-react sem role/label nao costumam ser anunciados por leitores de tela, mas o ideal e marcar explicitamente. Baixo risco, P2.

---

## 4. Responsividade

Auditoria feita via leitura de codigo (Tailwind breakpoints), ja que o dev server ficou indisponivel durante a sessao (ver secao 0). Recomendo reteste visual manual em 375/768/1440px depois de reiniciar `npm run dev`.

- [x] OK -- Hero nao deve estourar no mobile -- `text-[2.75rem]` (44px) mobile ate `md:text-[4.5rem]` (72px) desktop, `container-editorial` com padding responsivo (1.5rem ate 2.5rem ate 5rem).
- [x] OK -- Grids colapsam para 1 coluna -- `ProjectGrid`: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (1/2/3 conforme especificado). Pagina de case: blocos de conteudo max-w-2xl full-width no mobile; navegacao anterior/proximo `grid-cols-1 sm:grid-cols-2`. `/sobre` e `/contato`: `grid-cols-1 md:grid-cols-[...]`.
- [x] OK -- Font-size do corpo -- paragrafos de conteudo usam `text-[1.0625rem]` (17px), acima do minimo de 14px. O unico texto abaixo de 14px e `.meta-text` (12px, mono, uppercase) -- e um rotulo tipo "kicker" (Categoria / Ano / Cliente), nao corpo de texto corrido, entao esta dentro do padrao editorial esperado.
- [ ] ATENCAO -- Navegacao no mobile nao vira hamburguer por decisao de design (so 3 itens, sempre visiveis -- comentario explicito no codigo: "nunca hamburguer"). Isso e intencional, nao um bug. Porem nao consegui validar visualmente se "Natalia Machado" + os 3 links cabem sem quebrar/apertar em 375px com o dev server fora do ar. Recomendo checar manualmente assim que possivel -- se apertar, a correcao e reduzir o gap ou o tamanho do logotipo no mobile, nao adicionar hamburguer (isso seria mudanca de design, fora do meu escopo).
- [x] OK -- Modais no admin (`Dialog`/`AlertDialog`) usam `max-w-xs`/`max-w-sm` com `max-w-[calc(100%-2rem)]` -- nao estouram em telas pequenas.
- [ ] ATENCAO -- `components/admin/admin-nav.tsx` (nav interna do painel, nao indexada/publica) usa `flex items-center justify-between` sem breakpoint de colapso para os 3 itens + logo + botao Sair -- risco de aperto em 375px. Prioridade baixa (ferramenta interna, atras de autenticacao), mas vale revisar (P2).

---

## 5. SEO tecnico

- [x] OK -- `metadata` em todas as paginas publicas (`/`, `/sobre`, `/contato`, `/projetos/[slug]` via generateMetadata, `/admin/*` com `robots: { index: false, follow: false }` correto).
- [ ] ATENCAO -- `openGraph.images` ausente no metadata global (`app/layout.tsx`). Nao existe nenhuma imagem OG configurada para a home/fallback (nem `opengraph-image.tsx` nem asset em `/public`). Isso significa que compartilhar o link do site em WhatsApp/LinkedIn/Twitter nao mostra preview de imagem. Pendencia de produto -- precisa de um asset de marca (1200x630px) que nao existe no projeto; nao posso criar sozinho. As paginas de projeto usam `project.cover_image_url` como OG image, mas sem width/height declarados e com aspect ratio 4:3 (nao o 1.91:1 recomendado para OG) -- funcional, mas nao ideal (P2).
- [x] OK -- `alternates.canonical` configurado em todas as rotas publicas.
- [x] OK -- `sitemap.xml` e `robots.txt` presentes e coerentes -- `robots.ts` bloqueia `/admin` e aponta pro sitemap; `sitemap.ts` inclui rotas estaticas + todos os projetos publicados dinamicamente.
- [x] OK -- `lang="pt-BR"` no `<html>`.
- [x] OK -- `<title>` unico por rota via template.
- [ ] ATENCAO -- Meta description entre 120-160 caracteres:
  - Home: 163 caracteres, 3 acima do limite (borderline, aceitavel).
  - `/sobre`: 92 caracteres, abaixo do minimo.
  - `/contato`: 69 caracteres, abaixo do minimo.
  - `/projetos/[slug]`: era 206-268 caracteres (o context_text inteiro sendo usado como description, sempre estourando o limite) -- corrigido: criei `truncateForMeta()` em `lib/format.ts` (corta na ultima palavra antes de ~155 caracteres, com reticencias) e apliquei em generateMetadata de `app/projetos/[slug]/page.tsx`. Nao afeta o texto visivel na pagina, so a tag meta description e OG description.
  - `/sobre` e `/contato` ficaram como pendencia -- ajustar o comprimento e decisao de copy/produto, nao fiz edicao de texto de marketing por conta propria.
- [x] OK -- Semantica -- `<main>`, `<nav aria-label>`, `<header>`, `<footer>` usados corretamente; pagina de case usa `<div>` (nao `<article>`) para o conteudo do case dentro do `<main>`. Nao e um erro de a11y (heading estruturado cobre a navegacao), mas seria mais correto semanticamente. Nao corrigi por ser mudanca estrutural fora do escopo pedido. Flagando como sugestao P2.
- [ ] Structured data (JSON-LD) -- nao implementado (nem Person/Organization na home, nem CreativeWork nas paginas de case). Nao e obrigatorio para um portfolio, mas melhoraria rich snippets. P2.

---

## 6. Edge cases funcionais

- [x] OK -- Projeto sem imagem de hover -- `CrossfadeImage` so renderiza a camada de crossfade quando existe `hoverSrc`; sem hover, a capa fica estatica, sem erro.
- [x] OK -- 0 projetos publicados -- `ProjectGrid` mostra estado vazio amigavel ("Novos projetos em breve.") em vez de grid quebrado.
- [x] OK -- Slug inexistente -- `getProjectBySlug` retorna null (tanto no modo fallback quanto Supabase), `page.tsx` chama `notFound()`, que renderiza `not-found.tsx` (na marca, com CTA de volta).
- [x] OK -- Form de contato com inputs longos/maliciosos -- era um gap real: `contactSchema` so tinha `min()`, sem `max()` em nenhum campo, permitindo nome/e-mail/mensagem de tamanho arbitrario. Corrigido: adicionei max(120) no nome, max(254) no e-mail (limite tecnico de e-mail), max(5000) na mensagem, em `lib/validation/contact.ts`. Validacao roda tanto no client (react-hook-form + zod) quanto no server action (`app/contato/actions.ts` reusa o mesmo schema) -- dupla camada, nao da pra burlar so desabilitando JS.
- [x] OK -- Navegacao anterior/proximo no primeiro/ultimo projeto -- usa aritmetica modular para nunca ficar sem next/previous quando ha 2+ projetos; com exatamente 1 projeto publicado, a checagem de tamanho corretamente esconde a secao de navegacao inteira (sem bug de projeto apontando pra si mesmo).
- [x] OK -- Modo fallback vs modo Supabase -- revisei `lib/data/projects.ts`, `lib/data/about.ts`, `lib/data/messages.ts`, `lib/supabase/is-configured.ts`, `lib/supabase/middleware.ts`, `lib/supabase/server.ts`: a checagem `isSupabaseConfigured()` e consistente em todo lugar, sempre com fallback gracioso pro seed local (inclusive em caso de erro de query, nao so ausencia de config), sem lancar excecao nao tratada. A troca e segura.
- [x] OK -- Middleware de `/admin` -- sem Supabase configurado, qualquer rota `/admin/*` (exceto a propria pagina de login) redireciona pra `/admin?setup=1`; com Supabase configurado, protege rotas sem sessao e redireciona usuario ja logado pra fora do login. Matcher correto (`/admin`, `/admin/:path*`).
- [x] OK -- Loading states em acoes async -- ContactForm ("Enviando...", botao disabled), forms do admin (isPending do useActionState, upload de imagem com overlay "Enviando...").
- [x] OK -- Empty states em listas/dashboards -- `/admin/projetos` e `/admin/mensagens` tem empty state dedicado, nao so lista vazia silenciosa.
- [ ] Error boundary (`error.tsx`) -- estava ausente, so existia `not-found.tsx`. Qualquer erro de runtime nao tratado (falha de rede no Supabase configurado, excecao em render) derrubava pra tela branca generica do Next em producao. Corrigido: criei `app/error.tsx` com a mesma linguagem visual do `not-found.tsx` (header/footer do site, CTA "Tentar de novo" que chama reset(), e "Voltar para a home"), incluindo id="main-content" pro skip link funcionar aqui tambem.

---

## 7. Motion & Performance

- [x] OK -- Nenhuma animacao com `will-change` abandonado -- nao ha uso de will-change no CSS/componentes.
- [x] OK -- Nenhum `animate` em propriedade nao-composite -- CrossfadeImage anima so opacity; FadeIn/StaggerItem animam opacity + y (translateY, composite-friendly); template.tsx (transicao de rota) anima so opacity. Nenhuma animacao de width/height/top/left encontrada.
- [x] OK -- Sem sinais de re-render desnecessario -- componentes de motion sao pequenos e isolados, sem estado global compartilhado que forcaria re-render em cascata; SiteHeader usa um unico useState de scroll com listener passive:true.
- [x] OK -- Imagens usam next/image em 100% dos casos (capa, hover, galeria, foto do Sobre, prev/next nav, thumbnails do admin) -- so os placeholders locais em /public/placeholders sao SVG (liberado explicitamente via dangerouslyAllowSVG no next.config.ts, com CSP restritiva sandbox aplicada). sizes configurado em todos os usos relevantes; priority usado corretamente (3 primeiros cards da home, imagem de capa da pagina de case, foto do Sobre) sem abusar.
- [x] OK -- Fontes via next/font/google (Fraunces, Archivo, JetBrains Mono), display swap, subset latin only -- bem configurado, sem FOIT.
- [x] OK -- Client components usados so onde precisam -- ProjectCard, ProjectGrid, Hero, ArrowLink sao Server Components; SiteHeader, SiteFooter, ContactForm e os componentes de components/motion/* sao "use client" por necessidade real, nao por excesso.
- [ ] Import do framer-motion e o padrao (nao LazyMotion/domAnimation). Funciona bem e o tree-shaking do bundler ja reduz bastante, mas se quiser espremer ainda mais o bundle compartilhado (193 kB), migrar pra LazyMotion e uma otimizacao P2 futura -- nao bloqueia deploy.

---

## 8. Conteudo

- [x] OK -- Zero Lorem Ipsum -- busquei em todo app/, components/, lib/; nao encontrei nenhuma ocorrencia. Todo o copy (home, sobre, contato, 6 cases completos com contexto/desafio/solucao/resultado) e conteudo real e especifico da Natalia.
- [x] OK -- Zero TODO/FIXME/console.log/@ts-ignore no codigo de producao (os unicos matches de "todo" no grep eram a palavra portuguesa "todo/todos", falso positivo).
- [x] OK -- Links reais -- LinkedIn, e-mail (mailto:), WhatsApp (wa.me com mensagem pre-preenchida) todos com valores reais do seedAbout; resume_url vazio tem fallback tratado ("Curriculo em breve" em vez de link quebrado).
- [ ] ATENCAO -- Favicon -- `app/favicon.ico` presente, mas e (aparentemente) o icone padrao gerado pelo create-next-app, nao um asset de marca da Natalia. Sem apple-touch-icon, sem manifest.json/site.webmanifest. Pendencia de produto (precisa de asset de marca), nao corrigi.
- [x] OK -- Limpeza: removi 5 SVGs orfaos do create-next-app (file.svg, globe.svg, next.svg, vercel.svg, window.svg) em /public -- confirmei via grep que nao eram referenciados em nenhum lugar do codigo antes de apagar.

---

## 9. Correcoes recomendadas (priorizadas)

### P0 -- impede deploy
Nenhuma pendencia de codigo bloqueia deploy. O build de producao esta limpo. Unico P0 e operacional: reiniciar `npm run dev` antes de testar no navegador (ver secao 0) -- o servidor atual esta retornando 500 por conflito de `.next` compartilhado entre `next dev` e o `next build` que rodei durante a auditoria.

### P1 -- deve ser corrigido antes do launch
1. OG image ausente (`app/layout.tsx` sem openGraph.images) -- links compartilhados nao mostram preview. Precisa de um asset de marca 1200x630px.
2. Favicon generico -- trocar pelo icone real da marca; adicionar apple-touch-icon.png e manifest.json/site.webmanifest.
3. Validar visualmente o header em 375px (nav sem hamburguer por design -- so confirmar que "Natalia Machado" + os 3 links nao apertam/quebram em telas pequenas de verdade).
4. Rodar Lighthouse manualmente nas 4 rotas publicas principais e colar os resultados na secao 2 deste relatorio.

### P2 -- melhorias pos-launch
1. Meta description de /sobre (92 caracteres) e /contato (69 caracteres) abaixo do ideal de 120-160 -- ajuste de copy, nao fiz sozinho.
2. aria-hidden="true" explicito nos icones decorativos dentro de `<Alert>` (~13 ocorrencias).
3. `components/admin/admin-nav.tsx` sem colapso responsivo dedicado para mobile (ferramenta interna, baixo risco).
4. Envolver o conteudo da pagina de case em `<article>` em vez de `<div>` (semantica extra, nao afeta a11y na pratica).
5. Considerar LazyMotion/domAnimation do framer-motion para reduzir ainda mais o bundle compartilhado.
6. Adicionar width/height e considerar crop 1.91:1 dedicado para OG image das paginas de case (hoje usa a capa 4:3 direto).
7. Structured data (JSON-LD Person/CreativeWork) -- nao obrigatorio, melhora rich snippets.

---

## 10. O que foi corrigido nesta auditoria (resumo)

| # | Arquivo | Correcao |
|---|---|---|
| 1 | components/layout/site-header.tsx | Adicionado skip link "Pular para o conteudo" (sr-only, visivel no focus) |
| 2 | app/page.tsx, app/sobre/page.tsx, app/contato/page.tsx, app/projetos/[slug]/page.tsx, app/not-found.tsx | Adicionado id="main-content" no main para o skip link funcionar |
| 3 | app/projetos/[slug]/page.tsx | Corrigida hierarquia de headings: h4 para h2 (blocos de conteudo) e h3 para h2 (nav anterior/proximo), eliminando o pulo h1 -> h4 / h1 -> h3 |
| 4 | app/error.tsx (novo) | Criado error boundary raiz, ausente ate entao -- mesma linguagem visual do not-found.tsx |
| 5 | lib/validation/contact.ts | Adicionado max() em nome (120), e-mail (254) e mensagem (5000) -- fechando edge case de input malicioso/arbitrariamente longo |
| 6 | lib/format.ts + app/projetos/[slug]/page.tsx | Nova funcao truncateForMeta(); aplicada na meta description/OG description das paginas de case, que antes usavam o texto completo (206-268 caracteres, muito acima do limite de SEO) |
| 7 | public/*.svg | Removidos 5 SVGs orfaos do create-next-app, confirmados sem uso |

Build e lint confirmados limpos apos todas as correcoes (3 builds consecutivos, 0 erros/warnings).

---

## 11. Conclusao

ATENCAO: Aplique as correcoes P0 (reiniciar o dev server + rodar Lighthouse manualmente) e P1 (OG image, favicon de marca, validacao visual do header mobile) antes do deploy; ta tudo listado.

O codigo em si esta em otimo estado -- build limpo, lint limpo, a11y solida (contraste, foco, motion, formularios), edge cases bem tratados, sem conteudo placeholder. As pendencias restantes sao majoritariamente assets de marca que nao existem no repositorio (favicon, OG image) e verificacao visual manual (Lighthouse, header em dispositivo real), que exigem browser/design -- nao bugs de implementacao.
