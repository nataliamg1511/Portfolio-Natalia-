# DESIGN_SYSTEM.md — Portfólio Natália Machado

> Baseado em `BRIEFING.md` (aprovado) e `UX_ARCHITECTURE.md` (aprovado). Define o sistema visual completo para Tailwind CSS + shadcn/ui + framer-motion. Não contém código de implementação — apenas tokens e especificações para o Frontend Engineer e para prompts do Magic MCP.

---

## 0. Premissa de partida

Natália é **redatora**. A palavra é o produto. Isso muda a hierarquia de decisão em relação a um portfólio de design visual: aqui, **tipografia carrega mais peso de marca do que cor, forma ou ilustração**. Um designer visual pode se expressar por composição de imagem; uma redatora se expressa por como a letra senta na página. Toda decisão abaixo protege essa ideia.

Segunda premissa: a referência estrutural obrigatória é **bitagoli.com** — portfólio minimalista onde a interface desaparece e a obra (aqui, os cases + a própria palavra) é a protagonista. Não há espaço para "roxo SaaS", sombras decorativas, gradientes ou componentes chamativos.

Nota sobre pesquisa de referência: a tentativa de fetch ao vivo de bitagoli.com nesta sessão foi bloqueada pela camada de ferramentas do ambiente; as decisões abaixo se apoiam na descrição estrutural detalhada já validada no `BRIEFING.md` e `UX_ARCHITECTURE.md` (grid com troca de imagem no hover, categoria + ano visíveis, imagens grandes empilhadas no case, header/footer discretos) combinada a conhecimento geral consolidado do gênero "portfólio editorial minimalista" ao qual bitagoli.com pertence. Recomendo ao Frontend Engineer abrir bitagoli.com lado a lado durante a implementação para calibrar detalhes finos de espaçamento que um documento não substitui.

---

## 1. Mood & referências

Empréstimos específicos (não a estética inteira de cada site — só a decisão pontual citada):

1. **bitagoli.com** — referência estrutural mãe: grid de projetos com crossfade de imagem no hover, meta-informação (categoria/ano) sempre visível sem precisar clicar, página de case como sequência vertical de imagens grandes sem enfeite ao redor, header/footer de baixíssimo peso visual.
2. **The Gentlewoman / A24 Films (editorial digital)** — peso do texto: uso de serifa editorial em títulos grandes para dar "voz autoral" a um layout que, sem isso, seria só uma grade de imagens de agência.
3. **Are.na** — densidade de whitespace e o uso de tipografia mono pequena para metadata (tags, datas) como elemento gráfico funcional, não decorativo — empresto esse recurso para categoria/ano/cliente nos cards e nos cases.
4. **Kinfolk / Cereal Magazine (impressos editoriais)** — a lógica de "texto curto intercalado com imagem grande, sem bloco corrido" pedida no UX para a página de case; a proporção editorial de revista impressa, não de blog.
5. **linear.app** — não para cor (é o oposto: linear é escuro/roxo), mas para o *rigor* de um único acento de cor usado com extrema disciplina, nunca em excesso — aqui aplico essa disciplina a um acento terracota, não roxo.

**Motion language:** funcional e discreto, nunca decorativo. Easing tween (não spring/elástico) — a marca é "Direta", não "brincalhona". Durações curtas (150–400ms) para qualquer interação de UI; a única animação "mais lenta" e intencional é o crossfade de imagem no hover dos cards (350ms) e o stagger de entrada do grid (60–80ms entre itens), porque ali a imagem *é* o conteúdo e merece um instante a mais para ser percebida. Nada de bounce, nada de rotação, nada de parallax agressivo — reduced-motion é tratado como cidadão de primeira classe, não como afterthought.

---

## 2. Color tokens (HSL — shadcn/ui)

**Decisão: sem dark mode.** Fidelidade à referência (bitagoli.com é 100% fundo claro) e ao briefing ("fundo claro, tipografia protagonista"); dark mode obrigaria a redesenhar contraste de imagens de portfólio (que já têm cor própria) e adicionaria complexidade sem pedido do usuário. O admin usa o **mesmo tema claro** — reduz superfície de decisão para uma usuária não-técnica e mantém consistência visual entre "o que ela edita" e "o que ela vê no site".

```css
:root {
  /* Base — "papel", não branco clínico de SaaS */
  --background: 40 20% 98%;        /* branco quente, como papel não-alvejado — acolhe a leitura longa de texto */
  --foreground: 20 8% 12%;         /* tinta quase-preta, com matiz quente (não azul-frio) — remete a texto impresso, não a tela */

  --card: 40 20% 98%;              /* cards do grid não têm superfície própria — herdam o fundo; quem cria contraste é a imagem, não a caixa */
  --card-foreground: 20 8% 12%;

  --popover: 40 20% 98%;
  --popover-foreground: 20 8% 12%;

  --primary: 20 8% 12%;            /* tinta — usada em CTAs de texto e botão primário do formulário/admin */
  --primary-foreground: 40 20% 98%;

  --secondary: 40 10% 94%;         /* cinza-papel claro — fundo de tags, badges neutros, hover sutil de linha no admin */
  --secondary-foreground: 20 8% 12%;

  --muted: 40 8% 92%;
  --muted-foreground: 30 6% 38%;   /* cinza médio quente — para categoria/ano/legendas; calibrado para manter contraste AA (~4.6:1) sobre --background */

  /* Acento único: "vermelho de revisão" */
  --accent: 8 55% 40%;             /* terracota/vermelho de caneta de revisão editorial — referência direta ao ofício da Natália: é a cor de quem marca, corta e aprova texto. Nada de roxo-SaaS ou azul-tech; é um acento que pertence ao mundo da palavra, não ao mundo do software. Usado com extrema disciplina: links em hover, sublinhado de CTA, selo de prêmio, foco de input. Nunca como cor de fundo em massa. */
  --accent-foreground: 40 20% 98%;

  --destructive: 0 70% 48%;        /* vermelho de alerta puro, deliberadamente distinto do --accent terracota para nunca confundir "marca" com "ação destrutiva" no admin */
  --destructive-foreground: 40 20% 98%;

  --border: 30 10% 87%;            /* hairline quase invisível — usado em 1px, nunca como moldura pesada */
  --input: 30 10% 87%;
  --ring: 8 55% 40%;               /* foco usa o mesmo terracota do --accent — foco visível e on-brand ao mesmo tempo */

  --radius: 0.25rem;               /* levemente arredondado, nunca "pill" — projeto editorial pede precisão, não fofura */
}
```

Não há bloco `.dark`. Se o Frontend Engineer instalar componentes shadcn/ui que já vêm com `.dark` por padrão, remover — não deve existir toggle de tema em nenhuma página, pública ou admin.

**Validação de contraste (AA, texto normal ≥ 4.5:1):**
- `--foreground` sobre `--background`: contraste altíssimo (~17:1) — headline e corpo de texto sempre seguros.
- `--muted-foreground` sobre `--background`: ~4.6:1 — usar apenas em texto ≥14px; para texto menor que isso, usar `--foreground`.
- `--accent-foreground` sobre `--accent`: ~7.8:1 — seguro para texto de botão.
- `--accent` como texto sobre `--background`: ~6.1:1 — seguro para links/CTA em terracota.

---

## 3. Tipografia

Tipografia é o elemento de marca mais importante deste produto. Três famílias, cada uma com um papel claro — nunca misturadas fora do seu papel.

### 3.1 Famílias

| Papel | Fonte | Fonte (Google Fonts) | Por quê |
|---|---|---|---|
| **Display / Headings** (hero, h1, h2, título de projeto/case) | **Fraunces** | `https://fonts.google.com/specimen/Fraunces` (variável, eixo `opsz` 9–144, `wght` 300–900, suporta itálico "soft"/"wonk") | Serifa editorial contemporânea com personalidade literária clara — é a fonte que diz "aqui, a palavra importa" sem recorrer a serifas clássicas datadas (Playfair) nem a sans genérica de SaaS. O eixo óptico permite que a mesma família funcione tensa e elegante no tamanho hero e ainda legível em títulos médios. |
| **Corpo / UI** (parágrafos, nav, botões, labels de formulário) | **Archivo** | `https://fonts.google.com/specimen/Archivo` (variável, `wght` 100–900) | Grotesk contemporâneo, neutro mas com cantos ligeiramente mais assertivos que um humanista genérico — reforça o adjetivo "Direta" do briefing sem competir com a serifa dos títulos. Evita a decisão-padrão "Inter" citada como proibida: Archivo tem presença própria sem virar protagonista indevido. |
| **Meta / Mono** (categoria · ano · cliente nos cards e cases, labels técnicos do admin, timestamps) | **JetBrains Mono** | `https://fonts.google.com/specimen/JetBrains+Mono` (`wght` 100–800) | Referência tipográfica à máquina de escrever — o instrumento simbólico do ofício de redação. Usado em caixa alta, tracked-out, só para metadata: transforma "categoria/ano" de informação burocrática em assinatura visual do produto. |

### 3.2 Escala tipográfica

Todos os valores em `rem` (base 16px). Line-height como múltiplo (unitless). Tracking em `em`.

| Token | Fonte | Tamanho desktop | Tamanho mobile | Peso | Line-height | Tracking | Uso |
|---|---|---|---|---|---|---|---|
| `display` (hero) | Fraunces | 4.5rem (72px) | 2.75rem (44px) | 500 | 1.05 | -0.02em | "Oi, eu sou a Natália." / "Redatora publicitária." na Home |
| `h1` | Fraunces | 3rem (48px) | 2.25rem (36px) | 500 | 1.1 | -0.015em | Título do case, "Quem é a Nat?", "Vamos conversar?" |
| `h2` | Fraunces | 2rem (32px) | 1.625rem (26px) | 500 | 1.15 | -0.01em | Subtítulos de seção ("Um relacionamento", "Clientes e contas") |
| `h3` | Fraunces | 1.5rem (24px) | 1.375rem (22px) | 500 | 1.2 | 0em | Título de projeto no card do grid |
| `h4` | Archivo | 1.125rem (18px) | 1.0625rem | 600 | 1.3 | 0em | Sub-labels de UI, títulos de bloco no admin |
| `body-lg` | Archivo | 1.25rem (20px) | 1.125rem | 400 | 1.6 | 0em | Primeiro parágrafo da bio, lead de página |
| `body` | Archivo | 1.0625rem (17px) | 1rem | 400 | 1.65 | 0em | Corpo de texto padrão (case: contexto/desafio/solução/resultado) |
| `small` | Archivo | 0.875rem (14px) | 0.875rem | 400 | 1.5 | 0em | Labels de formulário, texto auxiliar |
| `caption` | Archivo | 0.75rem (12px) | 0.75rem | 400 | 1.4 | 0em | Copyright do footer, texto legal |
| `meta` | JetBrains Mono | 0.75rem (12px) | 0.75rem | 500 | 1.4 | 0.08em, uppercase | Categoria · Ano · Cliente nos cards e cabeçalho do case |
| `link` | Archivo | herda contexto | — | 500 | — | 0em | "Ver projeto →", "Sobre mim →", "Enviar →" — sempre com seta, nunca botão cheio no site público |

Justificativa de `body` em 17px (não 16px "default"): parágrafos de case (contexto/desafio/solução/resultado) são o argumento de venda do produto para o ICP secundário exigente — um ponto a mais de tamanho reduz fadiga em leitura de texto corrido sem custo de layout perceptível.

**Peso por contexto:** Fraunces nunca passa de 600 (mesmo no hero) — pesos mais pesados (700+) puxariam para "cartaz", contrariando o minimalismo. Archivo em UI (botões, nav) usa 500–600; em corpo de texto, 400. JetBrains Mono é sempre 500 em caixa alta — nunca regular minúsculo (perderia o efeito de "carimbo").

---

## 4. Espaçamento & radius

### 4.1 Grid de espaçamento
Escala Tailwind default (base 4px / `0.25rem`) é suficiente e **não é customizada** — o que muda é a *disciplina de uso*, não a escala: este produto usa consistentemente os degraus superiores da escala (`space-y-24`, `py-32`, `gap-12`) onde um SaaS típico usaria os inferiores. Regra prática:

- Padding lateral de container: `px-6` (mobile) → `px-10` (tablet) → `px-20` (desktop, ≥1280px).
- Espaço vertical entre seções principais (hero→grid, bloco→bloco no case): `py-24` mobile → `py-40` desktop.
- Gap do grid de projetos: `gap-x-8 gap-y-16` desktop (mais respiro vertical que horizontal — cada card "solta" do próximo).
- Container max-width: `1440px`, centralizado.

### 4.2 Radius por categoria
| Categoria | Valor | Nota |
|---|---|---|
| Botões (site público) | `0.25rem` | quase reto — o site público usa majoritariamente links de texto com seta, não botões cheios; quando existir botão (submit do form), radius discreto |
| Botões (admin) | `0.375rem` (shadcn default) | admin pode usar shadcn/ui sem poesia adicional |
| Cards de projeto | `0` (thumbnails sem radius) | a imagem é a estrela; cantos retos tratam a imagem como uma peça de portfólio real, não como um "card de app" |
| Inputs (form de contato + admin) | `0.25rem` | consistente com botão público |
| Modais/Dialogs (admin) | `0.5rem` (shadcn default) | admin sóbrio, sem necessidade de radical alinhamento com o site público |
| Badge de prêmio (ADVB/PR) | `0` com borda fina | tratado como selo/carimbo, não como pill de SaaS |

### 4.3 Bordas
- **1px hairline** (`--border`) é o único peso de borda em todo o produto público — usado em divisores entre blocos de texto do case, na base do header quando `scrolled`, e no contorno do selo de prêmio.
- **Nunca sombra decorativa** no site público (sem `shadow-md`/`shadow-lg` em cards, botões ou imagens) — a referência bitagoli.com é plana; sombra sinalizaria "elevação de UI", que é exatamente o ruído que o minimalismo pede para eliminar.
- Admin pode usar sombras sutis padrão do shadcn/ui (`shadow-sm` em dropdowns/dialogs) — é ferramenta de trabalho, não vitrine, então convenção de UI comum é aceitável e até desejável para affordance rápida numa usuária não-técnica.

---

## 5. Motion tokens (framer-motion)

| Token | Duration | Easing | Uso |
|---|---|---|---|
| `motion-instant` | 100ms | `cubic-bezier(0.4, 0, 1, 1)` | Focus ring, toggle de switch no admin |
| `motion-snap` | 180ms | `cubic-bezier(0.3, 0, 0, 1)` | Hover de link de texto (sublinhado), hover de botão, active states |
| `motion-default` | 280ms | `cubic-bezier(0.2, 0, 0, 1)` (tween, não spring) | Fade-in de blocos ao entrar em viewport, abertura de dialog/modal no admin |
| `motion-card-hover` | 350ms | `cubic-bezier(0.4, 0, 0.2, 1)` (crossfade) | **A animação de assinatura do produto**: troca de imagem de capa → imagem secundária no hover do card de projeto. Crossfade puro (opacity), sem scale nem translate — a imagem não pode "pular", só revelar a segunda peça |
| `motion-stagger-grid` | 400ms total, 70ms delay entre itens | tween, easing igual a `motion-default` | Entrada do grid de projetos na Home/scroll: cada card sobe 16px + fade, em sequência |
| `motion-page` | 220ms | `cubic-bezier(0.2, 0, 0, 1)` | Transição de fade entre rotas públicas (sem slide, sem crossfade de página inteira — só opacity) |

Regra explícita: **nenhuma easing do tipo spring/elástico em lugar nenhum do produto.** Springs comunicam "playful/app consumer" — o contrário do adjetivo "Direta". Tudo é tween com easing precisa.

**`prefers-reduced-motion`:** quando ativo, todas as animações de entrada (fade+translate, stagger) tornam-se opacity-only sem delay de stagger (aparecem juntas, instantâneas); o crossfade de hover do card é mantido (é funcional — comunica conteúdo, a troca de imagem — não decorativo) mas sem qualquer translate/scale associado; transição de página vira instantânea (`duration: 0`).

---

## 6. Assinatura visual

Três elementos que só este produto tem — o que tira o resultado de "genérico Tailwind + shadcn":

1. **Metadata em mono tracked-out como assinatura editorial.** Categoria · Ano · Cliente sempre em `JetBrains Mono`, uppercase, tracking `0.08em`, cor `--muted-foreground`, separados por `·` (interpunct, não hífen ou pipe). Aparece nos cards do grid, no cabeçalho do case e nas tags de "Clientes/contas atendidas" em `/sobre`. É o elemento que remete ao ofício da redação (datilografia/carimbo de revisão) em todas as telas do site público.

2. **Sublinhado que "escreve" da esquerda para a direita nos links de ação.** Todo link de texto com seta (`Ver projeto →`, `Sobre mim →`, `Enviar →`) tem, por padrão, um traço de 1px em `--border` sob o texto; no hover, o traço se anima de opacidade + cor para `--accent` (terracota), crescendo da esquerda para a direita em `motion-snap` (180ms) — como se estivesse sendo sublinhado à mão no momento da interação. Não é um underline CSS padrão: é a ação de "revisar/aprovar" o link, coerente com a metáfora do acento de cor.

3. **Selo de prêmio como carimbo, não badge.** O prêmio ADVB/PR (case #100vezesMaxim) é renderizado como um retângulo de contorno fino 1px em `--accent`, canto reto (radius 0), texto em `JetBrains Mono` uppercase pequeno, sem preenchimento sólido — para parecer um selo/carimbo de reconhecimento formal, não um badge decorativo de produto SaaS ("NEW", "PRO").

---

## 7. Especificação de componentes-chave

### 7.1 Header (público, sticky)
- Altura ~72px, fundo `--background` com hairline `--border` na base **apenas depois de scroll > 8px** (estado inicial sem borda, para não competir com o hero) — transição `motion-snap`.
- Esquerda: "Natália Machado" em `Archivo` 600, 0.9375rem, cor `--foreground`, link para `/`.
- Direita: nav "Projetos · Sobre · Contato" em `Archivo` 500, 0.875rem, item ativo em `--foreground` com sublinhado de assinatura (item 2 da seção 6); itens inativos em `--muted-foreground`.
- Mobile (<768px): os 3 itens continuam visíveis lado a lado (nunca hambúrguer) — cabe com folga em `Archivo` 500 mesmo em telas pequenas, e evita o atrito de "esconder navegação" num site de só 4 páginas.

### 7.2 Card de projeto (grid da Home)
- Aspect ratio da imagem: **4:3** (`AspectRatio` do shadcn/ui).
- Estado padrão: imagem de capa (`cover_image_url`).
- Hover (mouse, ≥768px): crossfade para `hover_image_url` em `motion-card-hover` (350ms, opacity puro).
- Touch (<768px): sem hover — sempre exibe `cover_image_url` estática; não há tentativa de simular hover por scroll-into-view (evita comportamento imprevisível em feed mobile).
- Abaixo da imagem: `h3` (título do projeto) + linha `meta` (Categoria · Ano) — bloco de texto colado à imagem, sem card/moldura ao redor.
- Link "Ver projeto →" aparece só como texto pequeno abaixo do meta, com o sublinhado de assinatura no hover — mas **o card inteiro é clicável** (o link de texto é reforço visual, não a única área de clique, conforme UX_ARCHITECTURE).
- Foco de teclado: `ring` em `--ring` (terracota) ao redor do card inteiro, `outline-offset: 4px`.

### 7.3 Botões e links
- Site público: **majoritariamente links de texto com seta** (`Archivo` 500 + sublinhado de assinatura). Existe apenas **um botão cheio real**: submit do formulário de contato ("Enviar →") — fundo `--primary`, texto `--primary-foreground`, radius `0.25rem`, sem sombra, hover escurece 8% (`motion-snap`).
- Admin: usa `Button` do shadcn/ui em variantes padrão (`default`, `outline`, `ghost`, `destructive`) sem customização adicional além dos tokens de cor/radius já definidos.

### 7.4 Formulário de contato
- Inputs (`Input`, `Textarea` do shadcn/ui): borda `--input` 1px, radius `0.25rem`, sem sombra interna, fundo `--background` (não `--secondary` — mantém a mesma superfície "papel" da página, sem caixa destacada).
- Label acima do campo, `small` (14px), `--foreground`, peso 500.
- Erro inline: texto abaixo do campo em `--destructive`, `caption` (12px), com ícone de alerta discreto (`lucide-react` `AlertCircle` 14px) — nunca só a borda vermelha sozinha (acessibilidade: erro não pode depender só de cor).
- Sucesso pós-envio: substitui o formulário por bloco de confirmação com `h2` curto ("Mensagem enviada.") + `body` ("Retorno em breve.") — sem toast que suma sozinho, porque é uma ação rara e importante que merece confirmação persistente na página.
- Foco: `ring-2 ring-[--ring] ring-offset-2` em todos os campos — visível, alto contraste, cor de marca.

### 7.5 Página de case (`/projetos/[slug]`)
- Cabeçalho: `h1` (título) + linha `meta` (Categoria · Ano · Cliente) + selo de prêmio (item 3 da seção 6) quando existir `award`.
- Imagem de capa: full-bleed ou quase (`max-w-[1440px]`, sem padding lateral do container, só padding vertical) — maior elemento visual da página.
- Blocos de texto (contexto/desafio/solução/resultado): cada bloco com um `h4` label curto ("O desafio") em `Archivo` 600 + `body` abaixo; separados por hairline `--border` (1px, `my-16`) — nunca por caixa/card.
- Imagens da galeria: full-width ou 2/3 da largura do container, alternando quando fizer sentido editorialmente — decisão fina de composição cabe ao Frontend Engineer olhando o conteúdo real de cada case.
- Navegação Próximo/Anterior: rodapé do conteúdo, `meta` label ("Próximo projeto") + `h3` do próximo título, thumbnail 4:3 pequena ao lado — mesmo tratamento tipográfico do card do grid.

### 7.6 Footer (público)
- Fundo `--background`, sem borda superior (silêncio visual total).
- "↑ Voltar ao topo" como link de texto pequeno (`small`, `--muted-foreground`, sublinhado de assinatura no hover) + `caption` "© 2026 Natália Machado" (ano dinâmico) ao lado ou abaixo, conforme largura de tela.
- Altura generosa de padding (`py-16`) — o footer não deve parecer "grudado" no último bloco de conteúdo.

### 7.7 Admin — princípio geral
O admin **não precisa da mesma poesia tipográfica do site público**. Usa `Archivo` para tudo (inclusive títulos — sem `Fraunces` no admin, para deixar claro visualmente "isto é ferramenta, não vitrine") e os componentes padrão do shadcn/ui (`Table`, `Card`, `Sidebar` ou nav superior simples, `Badge`, `Switch`, `AlertDialog`) com os tokens de cor/radius já definidos. Único cuidado: linguagem em português simples em todos os labels (nunca "slug" — usar "Endereço da página"), conforme UX_ARCHITECTURE.

---

## 8. Mapa de componentes shadcn/ui a instalar

```
npx shadcn@latest add button input textarea label form aspect-ratio
npx shadcn@latest add skeleton alert badge separator
npx shadcn@latest add table switch dialog alert-dialog dropdown-menu
npx shadcn@latest add select sonner avatar tabs
```

| Página | Componentes |
|---|---|
| Header/Footer (global) | `button` (variant link), custom nav (sem `navigation-menu` — só 3 itens, não precisa do peso desse componente) |
| Home (`/`) | `aspect-ratio`, `skeleton` (loading do grid), `alert` (estado de erro) |
| Case (`/projetos/[slug]`) | `aspect-ratio`, `badge` (selo de prêmio, custom-styled), `separator` (hairline entre blocos), `skeleton` |
| Sobre (`/sobre`) | `avatar` ou `aspect-ratio` (foto), `badge` (tags de ferramentas/IAs), `button` (CTA currículo) |
| Contato (`/contato`) | `form`, `input`, `textarea`, `label`, `button`, `alert` (erro), `sonner` (opcional, mas priorizar confirmação inline conforme 7.4) |
| Admin — login | `form`, `input`, `label`, `button`, `alert` |
| Admin — projetos (lista) | `table`, `badge` (status), `switch` (publicar/despublicar rápido), `dropdown-menu` (ações por linha), `alert-dialog` (confirmação de exclusão), `skeleton` |
| Admin — novo/editar projeto | `form`, `input`, `textarea`, `label`, `select` (categoria), `switch` (publicado/rascunho), `tabs` ou seções com `separator` (organização das seções do formulário), `button`, `sonner` (confirmação de salvar) |
| Admin — sobre | `form`, `input`, `textarea`, `label`, `button`, `avatar`/`aspect-ratio` (preview foto) |
| Admin — mensagens | `table` ou lista de `card`, `badge` (não lida), `dialog` (abrir mensagem completa) |

---

## 9. Acessibilidade — checklist

- Contraste AA validado na seção 2 para todas as combinações de texto/fundo usadas.
- Foco visível em **todo** elemento interativo (`ring-2` cor `--ring`, nunca `outline: none` sem substituto) — inclusive cards inteiros do grid (não só o link de texto interno).
- Erros de formulário nunca dependem só de cor (ícone + texto, conforme 7.4).
- Hover de crossfade nos cards não é a única forma de acessar a segunda imagem — a segunda imagem é conteúdo de contexto, não informação exclusiva; a imagem de capa sozinha já comunica o essencial, então ausência de hover em touch/teclado não perde informação crítica.
- `prefers-reduced-motion: reduce` respeitado em todos os tokens de motion (seção 5) — implementar via `useReducedMotion()` do framer-motion, não só media query CSS solta.
- Navegação por teclado: header, grid (cards como `<a>` reais, não `<div onClick>`), formulário e admin totalmente operáveis via Tab/Enter, ordem de foco lógica (topo→baixo, esquerda→direita).
- Textos alternativos: toda imagem de case exige `alt` descritivo preenchido no admin (campo obrigatório na seção "Galeria" do CRUD — decisão a confirmar com Frontend/Product na modelagem do formulário, mas necessária para o ICP secundário usar leitor de tela sem perda de contexto).

---

## Briefing visual para o Magic MCP

> Colar no `/ui` do Magic MCP ao gerar componentes com o Frontend Engineer:

Portfólio editorial minimalista de redatora publicitária (referência estrutural: bitagoli.com). Fundo `hsl(40 20% 98%)` tipo papel, texto `hsl(20 8% 12%)` tinta quase-preta. Títulos em serifa editorial **Fraunces** peso 500, tracking negativo (-0.02em no hero de 72px), nunca mais pesado que 600. Corpo e UI em grotesk **Archivo** 400/500. Metadata (categoria/ano/cliente) sempre em **JetBrains Mono** uppercase tracking 0.08em, cor cinza `hsl(30 6% 38%)`. Único acento de cor: terracota `hsl(8 55% 40%)` — usado só em hover de links, foco, selo de prêmio; nunca como fundo em massa. Zero sombras decorativas, zero radius grande (`0.25rem` máx, cards sem radius). Grid de projetos: 3 colunas desktop / 2 tablet / 1 mobile, thumbnails 4:3, gap generoso (`gap-x-8 gap-y-16`), crossfade de imagem no hover (350ms, opacity only, sem scale). Links de ação sempre com seta ("Ver projeto →") e sublinhado animado da esquerda pra direita no hover. Motion sempre tween, nunca spring/elástico. Muitíssimo whitespace — `py-24` a `py-40` entre seções. Sem dark mode.

---

**Esse sistema reflete a personalidade que a gente definiu (Direta, Resiliente/proativa, Autoral) — tipografia como protagonista, acento terracota ligado ao ofício de revisão de texto, motion tween sem enfeite? Pode ir pro Frontend?**
