# MOTION_NOTES.md — Polish do Motion Specialist

> Registro do que foi ajustado sobre o motion básico já implementado pelo Frontend Engineer, e por quê. Todos os valores respeitam os tokens de `DESIGN_SYSTEM.md` seção 5 (tween, nunca spring; durações 100–350ms; `prefers-reduced-motion` como cidadão de primeira classe). Admin não foi tocado, exceto o ajuste de `duration-100` em `input.tsx`/`textarea.tsx` (componente compartilhado, detalhado abaixo).

---

## 1. Sublinhado de assinatura — correção de fidelidade ao design system

**Antes:** `.link-underline::after` era uma linha `width: 100%` sempre visível com `transform: scaleX(1)` estático; o hover só trocava a `background-color` de `--border` para `--accent`. Não havia nenhum "crescimento" — a especificação da seção 6.2 do DESIGN_SYSTEM ("traço que se anima... crescendo da esquerda para a direita") não estava implementada de fato, apesar do nome da classe sugerir isso.

**Depois:** duas camadas de pseudo-elemento:
- `::after` — hairline estática em `--border`, sempre visível (mantém a legibilidade do link mesmo sem hover, como um sublinhado discreto de link).
- `::before` — traço em `--accent`, `transform: scaleX(0)` → `scaleX(1)` com `transform-origin: left`, 180ms `cubic-bezier(0.3, 0, 0, 1)` (token `motion-snap`), disparado em `:hover` e `:focus-visible`.

Resultado: no hover/foco, um traço terracota "escreve" da esquerda para a direita por cima da hairline neutra — a metáfora de caneta de revisão editorial que o design system pede. Ao sair do hover, o traço recolhe pela mesma origem (`left`), sem troca de `transform-origin`, para manter o movimento previsível e barato (só `transform`, sem repaint).

Afeta: nav do header, `ArrowLink` (Hero, 404), "Ver projeto →" do card, links de contato direto, "↑ Voltar ao topo" do footer.

Também adicionei `.group:hover`/`.group:focus-visible` como gatilho extra (além do hover direto no texto) para `.link-underline::before` e `.arrow-trailing`: como o `ProjectCard` inteiro é a área de clique real (DESIGN_SYSTEM.md 7.2 — "o link de texto é reforço visual, não a única área de clique"), o sublinhado/seta do "Ver projeto →" agora reage ao hover em qualquer ponto do card, não só quando o mouse está exatamente sobre o texto pequeno.

## 2. Seta com micro-deslocamento no hover/focus

Nenhum lugar do site tinha a seta como elemento separado — ela estava embutida no texto ("Sobre mim →", "Enviar →" etc.), então não dava para animá-la isoladamente sem também deslocar o texto. Refatorei os pontos de contato para renderizar a seta num `<span aria-hidden>` próprio com as classes utilitárias novas:

- `.arrow-trailing` — `translateX(3px)` no hover/focus do link/botão pai (setas "→" no final).
- `.arrow-leading` — `translateX(-3px)` (seta "←" no início, ex.: "Projeto anterior").
- `.arrow-up` — `translateY(-3px)` (seta "↑" do "Voltar ao topo").

Todas em 180ms `motion-snap`, `transform`-only (sem layout thrash). Aplicado em: `ArrowLink`, `ProjectCard`, `SiteFooter`, formulário de contato (botão "Enviar →"), `/sobre` ("Ver currículo →"), nav de próximo/anterior do case.

O texto (`children`) do `ArrowLink` deixou de incluir o "→" manualmente — o componente agora anexa a seta sozinho. Ajustei as duas chamadas existentes (`Hero`, `not-found.tsx`) para passar só o rótulo.

## 3. Header — reação ao scroll

**Antes:** `bg-background/95 backdrop-blur` era aplicado o tempo todo; só a borda inferior era condicional a `scrolled`.

**Depois:** fundo + blur + borda entram juntos, com a mesma transição (180ms, `motion-snap`), condicionados ao mesmo estado `scrolled` (scroll > 8px). No topo da página o header fica transparente (sem competir com o hero, que já é o primeiro bloco de conteúdo — como o header ocupa espaço normal no fluxo em vez de sobrepor o hero nesse momento, não há perda de legibilidade). Ao rolar, o header ganha opacidade/blur suavemente, dando o feedback de profundidade sem sombra (proibida pelo design system).

Não usei framer-motion aqui — é uma transição de cor/filtro simples, coberta pelo kill-switch de `prefers-reduced-motion` do item 6.

## 4. Página de case — nav de Próximo/Anterior

**Antes:** os links de navegação entre projetos não tinham `focus-visible` (gap de acessibilidade de teclado) nem qualquer feedback de hover — a única pista de interatividade era o cursor do navegador.

**Depois:**
- `focus-visible:ring-2 ring-ring ring-offset-4` — mesmo padrão usado no `ProjectCard`, agora consistente em todo o site.
- Hover/foco desloca a linha inteira 4px na direção da navegação (`hover:-translate-x-1` no "anterior", `hover:translate-x-1` no "próximo") — reforça hierarquia/continuidade sem usar scale nem sombra.
- Thumbnail ganha `opacity-85` sutil no hover do grupo, sinalizando que a linha inteira é clicável.
- Seta "←"/"→" no label ganhou o mesmo tratamento do item 2.

## 5. Entrada de imagens grandes no case (scroll-triggered)

Estendi `FadeIn` para aceitar um prop `margin` (rootMargin do IntersectionObserver, mesma sintaxe do framer-motion) em vez do valor fixo `-80px` embutido. Motivo: `-80px` fixo se comporta de forma inconsistente entre uma tela de celular (altura ~700px) e um monitor grande — o percentual escala melhor. Também troquei o default de `FadeIn`/`StaggerContainer` de `-80px` para `-10% 0px`.

Para as imagens grandes do case (capa full-bleed e galeria), usei `margin="-5% 0px"` (mais generoso — dispara mais cedo) combinado com `y={20}` (levemente mais perceptível que os 16px do padrão de blocos de texto, coerente com o peso visual maior da imagem). Blocos de texto continuam com o default (`y=16`, `margin="-10% 0px"`).

## 6. Lacunas de `prefers-reduced-motion` cobertas

O `useReducedMotion()` do framer-motion já cobria `FadeIn`, `StaggerContainer/Item`, `CrossfadeImage` e `Template`. Duas lacunas reais:

1. **Transições CSS puras** (sublinhado, seta, hover do header, hover da nav do case, `active:translate-y-px` dos botões) não passam por JS — não existia nenhuma rede de segurança para elas. Adicionei um bloco `@media (prefers-reduced-motion: reduce)` global em `globals.css` que zera `animation-duration`/`transition-duration` e força `scroll-behavior: auto`. Não interfere no framer-motion (que anima via WAAPI/style direto, não via propriedade CSS `transition`), então não há dupla aplicação.
2. **`SiteFooter.scrollToTop`** chamava `window.scrollTo({ behavior: "smooth" })` incondicionalmente — o `scroll-behavior: auto !important` do kill-switch já neutraliza o CSS, mas o parâmetro JS do `scrollTo` ainda pedia scroll suave via API, então adicionei uma checagem `matchMedia("(prefers-reduced-motion: reduce)")` para passar `behavior: "auto"` diretamente.
3. **Confirmação de sucesso do formulário de contato** (`contact-form.tsx`) animava `y: 8 → 0` sem checar `useReducedMotion()`. Corrigido.

## 7. Ajuste fino de token — inputs/textarea

`Input` e `Textarea` usavam `transition-colors` sem duração explícita (default do Tailwind, 150ms). O design system define o foco de campo como token `motion-instant` (100ms). Troquei para `transition-colors duration-100` nos dois componentes — pequeno, mas fecha a fidelidade ao token documentado. Esses componentes são compartilhados com o admin; o ajuste é neutro lá (não adiciona nem remove comportamento, só ajusta 50ms).

## 8. O que já estava certo e não foi tocado

- **Crossfade do card** (`CrossfadeImage`): já em 350ms, opacity-only, sem scale/translate, suave nos dois sentidos (o `whileHover` do framer-motion já anima de volta ao estado `animate` usando a mesma transição ao tirar o mouse). Confirmado, não alterado.
- **Stagger do grid**: delay de 70ms entre itens e duração de 280ms por item já batiam com o token `motion-stagger-grid`. Só ajustei o `margin` do viewport (item 5 acima).
- **Template de transição de página** (`app/template.tsx`): fade puro de 220ms, sem slide, já correto — não mexi para não violar a regra explícita do design system ("sem slide, sem crossfade de página inteira — só opacity").

---

## Animação-assinatura

A animação-assinatura do produto continua sendo o **sublinhado que "escreve" da esquerda para a direita** (seção 6.2 do DESIGN_SYSTEM) — só que agora ela de fato existe como movimento, não como troca de cor estática. Combinada ao **micro-deslocamento das setas de ação**, o par funciona como uma assinatura coerente: qualquer link de ação do site (nav, cards, CTAs, nav de case) reage da mesma forma sutil e editorial, nunca chamativa — reforçando a metáfora do ofício de revisão de texto sem recorrer a bounce, scale ou cor fora do acento terracota já aprovado.

---

**Build:** `npm run build` rodou limpo (Next 15.5.23 / Turbopack), zero erros de tipo ou lint, todas as rotas estáticas/SSG geradas normalmente.

Pode passar pro QA auditor validar performance e a11y?
