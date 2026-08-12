# UX_ARCHITECTURE.md — Portfólio Natália Machado

> Baseado em `BRIEFING.md`. Define estrutura, hierarquia e fluxos. Cor, tipografia, componentes e animações são responsabilidade do UI Designer na próxima etapa.

---

## 1. Sitemap

```
/
├── /                          (Home — hero + grid de projetos)
├── /projetos/[slug]           (Case individual)
├── /sobre                     (Bio, clientes, ferramentas, currículo)
├── /contato                   (Formulário + contatos diretos)
└── /admin                     (autenticado — Supabase Auth, usuário único)
    ├── /admin                 (login)
    ├── /admin/projetos        (lista + reordenar + publicar/despublicar)
    ├── /admin/projetos/novo   (criar)
    ├── /admin/projetos/[id]   (editar)
    ├── /admin/sobre           (editar bio/foto)
    └── /admin/mensagens       (inbox do formulário de contato)
```

Notas de rota:
- Site público não tem prefixo de idioma (100% PT-BR, sem i18n nesta entrega).
- `/admin/*` inteiro fica atrás de middleware de autenticação — qualquer rota admin sem sessão válida redireciona para `/admin` (login).
- Não há rota de cadastro admin (`/admin/signup` não existe — usuário único provisionado manualmente no Supabase).

---

## 2. Wireframes por página

### 2.1 `/` — Home

**Objetivo da página:** em poucos segundos, comunicar quem é a Natália e levar o visitante (recrutador/diretor de criação) a abrir um case.

**Blocos em ordem vertical:**

1. **Header fixo** (persiste em todas as páginas públicas, sticky no topo)
   - Conteúdo: logo/nome "Natália Machado" à esquerda; nav à direita: "Projetos" · "Sobre" · "Contato".
   - Hierarquia: baixo peso visual — não compete com o hero. Nome funciona como link para `/`.
   - Interação: nav com estado ativo para a página corrente; comportamento sticky ao rolar (sem esconder/mostrar dinâmico nesta fase — decisão de UI).

2. **Hero**
   - Conteúdo: "Oi, eu sou a Natália." (linha 1) + "Redatora publicitária." (linha 2, título profissional) + link "Sobre mim →".
   - Hierarquia: maior peso tipográfico da página inteira — é o único elemento acima da dobra além do header.
   - Interação: "Sobre mim →" leva a `/sobre`; sem carrossel, sem imagem de fundo pesada (mantém minimalismo pedido no briefing).
   - Atrito possível: visitante que já sabe quem é ela e só quer ver trabalho — por isso o grid de projetos vem imediatamente abaixo, sem scroll longo até lá.

3. **Grid de projetos** (bloco central e principal da Home)
   - Conteúdo por card: imagem de capa (troca para segunda imagem no hover), título do projeto, categoria (ex: "Campanha", "Case institucional"), ano, "Ver projeto →".
   - Hierarquia: bloco com mais espaço na página; cada card tem peso igual entre si — a ordem de exibição (definida no admin) é o que sinaliza relevância, não o tamanho do card.
   - Fonte de dados: Supabase, somente projetos com `status = published`, ordenados por `display_order`.
   - Interação: hover troca imagem de capa por imagem secundária (mostra peça em uso/contexto); clique no card inteiro (não só no link de texto) leva a `/projetos/[slug]`.
   - Atrito possível: grid vazio se ainda não houver projeto publicado → ver seção 6 (Estado vazio).

4. **Footer**
   - Conteúdo: "↑ Voltar ao topo" + copyright ("© 2026 Natália Machado" — ano dinâmico).
   - Hierarquia: menor peso da página, texto pequeno.
   - Interação: "↑ Voltar ao topo" faz scroll suave para o topo da página.

**Decisão de uma ação principal:** a ação-alvo da Home é "abrir um projeto". "Sobre mim" e "Contato" são suporte, não o objetivo primário.

---

### 2.2 `/projetos/[slug]` — Case individual

**Objetivo da página:** provar, com contexto real (cliente, desafio, solução, resultado), que a Natália pensa estrategicamente — não só escreve peça avulsa.

**Blocos em ordem vertical:**

1. **Header fixo** (mesmo de todas as páginas públicas).

2. **Cabeçalho do case**
   - Conteúdo: título do projeto, categoria, ano, cliente (quando aplicável — ex: "Prefeitura de Curitiba", "DETRAN"), badge/menção de prêmio quando existir (ex: "Top of Marketing ADVB/PR" no case #100vezesMaxim).
   - Hierarquia: título com peso alto, mas menor que o hero da Home — aqui quem deve ganhar destaque visual é a imagem que vem a seguir.
   - Interação: nenhuma além de leitura.

3. **Imagem de capa em destaque** (full-bleed ou quase)
   - Conteúdo: peça principal do case em alta resolução.
   - Hierarquia: maior elemento visual da página.

4. **Blocos de contexto + imagem, intercalados** (repete N vezes conforme a galeria/descrição do projeto)
   - Estrutura de cada bloco: texto curto (contexto do cliente / desafio / solução criativa / resultado) seguido ou precedido de uma imagem grande da galeria.
   - Conteúdo sugerido por sub-bloco de texto:
     - **Contexto do cliente**: quem é o cliente, o que ele precisava.
     - **O desafio**: o problema de comunicação/negócio por trás do briefing.
     - **A solução criativa**: o racional — por que esse caminho, não outro.
     - **O resultado**: métrica, prêmio, repercussão (quando existir).
   - Hierarquia: imagem tem mais peso visual que o texto; texto é objetivo (parágrafos curtos, sem bloco corrido longo) — reforça a personalidade "direta" do briefing.
   - Interação: nenhuma interação complexa — é leitura e rolagem vertical (fiel à referência bitagoli.com: "imagens grandes empilhadas sem distração").
   - Fonte de dados: vem do CRUD do admin — texto do case armazenado como blocos estruturados (ver modelo de dados) e galeria de imagens em ordem.

5. **Navegação Próximo/Anterior projeto** (opcional, mas recomendada)
   - Conteúdo: link para o próximo case publicado (por `display_order`), com nome + thumbnail pequena.
   - Hierarquia: baixo peso, no rodapé do conteúdo, antes do footer.
   - Interação: mantém o visitante no site em vez de deixá-lo "encalhado" no fim de um case — reduz atrito de abandono.

6. **Footer** (padrão).

**Atrito possível:** case sem contexto suficiente parece "peça avulsa" (a objeção do ICP secundário no briefing). Por isso os 4 sub-blocos de texto (cliente/desafio/solução/resultado) são tratados como estrutura recomendada no admin, não campo livre único — orienta a Natália a sempre preencher esse racional.

---

### 2.3 `/sobre` — Sobre

**Objetivo da página:** humanizar a marca pessoal e mostrar prova social de contas relevantes (clientes/marcas atendidas) sem depender do grid de projetos.

**Blocos em ordem vertical:**

1. **Header fixo** (padrão).

2. **Bloco foto + bio principal**
   - Conteúdo: foto da Natália + título "Quem é a Nat?" + texto de bio (conteúdo seed do briefing, tom de voz em primeira pessoa, preservado integralmente).
   - Hierarquia: foto e headline "Quem é a Nat?" dividem o maior peso da página.
   - Interação: nenhuma além de leitura.

3. **Bloco complementar de bio** ("Um relacionamento")
   - Conteúdo: segundo texto seed do briefing (história pessoal — comerciais de TV, "escrevia filmes" para bonecas etc.).
   - Hierarquia: peso secundário, tipografia de leitura corrida.

4. **Social proof — clientes/marcas atendidas**
   - Conteúdo: lista/grid simples de nomes de clientes e contas (ex: Prefeitura de Curitiba, DETRAN, marcas dos cases publicados).
   - Hierarquia: peso médio — funciona como prova social textual (não há logo oficial de prefeitura/DETRAN necessariamente, então pode ser lista tipográfica em vez de grid de logos).
   - Justificativa de posição: aparece logo após a bio, não escondido no fim — reforça a "sofisticação alta" do ICP secundário, que busca sinal de contas grandes rapidamente.

5. **Ferramentas / IAs utilizadas**
   - Conteúdo: lista curta (ChatGPT, Gemini, Claude, Perplexity, Grok, Trello, Notion, Publi Manager) — sinaliza atualização com o mercado.
   - Hierarquia: peso baixo, formato de lista/tags.

6. **CTA de currículo**
   - Conteúdo: link/botão "Baixar currículo" ou "Ver currículo →" (aponta para link do Google Drive).
   - Hierarquia: peso destacado o suficiente para não ser perdido — é uma ação de conversão direta para quem está recrutando.
   - Interação: abre em nova aba (link externo).

7. **Footer** (padrão).

**Atrito possível:** bio longa demais pode perder quem só quer avaliar portfólio rápido. Mitigação: bio + prova social primeiro, ferramentas e currículo no fim — quem só quer o currículo rola até achar rápido pela hierarquia clara de blocos curtos.

---

### 2.4 `/contato` — Contato

**Objetivo da página:** capturar contato de quem quer falar com a Natália (proposta, vaga, freela pontual) com o menor atrito possível, e oferecer alternativa direta para quem prefere não usar formulário.

**Blocos em ordem vertical:**

1. **Header fixo** (padrão).

2. **Título da página**
   - Conteúdo: headline curta (ex: "Vamos conversar?").
   - Hierarquia: peso alto, mas enxuto — um título, não um parágrafo de introdução longo.

3. **Formulário de contato**
   - Campos: Nome* (texto), E-mail* (texto/email), Mensagem* (textarea), botão "Enviar →".
   - Hierarquia: elemento central e de maior peso funcional da página.
   - Interação: validação client-side dos campos obrigatórios antes do submit; grava em `messages` no Supabase; estado de sucesso e de erro (ver seção 6); nenhum campo opcional adicional — só o essencial, reduz atrito de preenchimento.

4. **Contatos diretos**
   - Conteúdo: LinkedIn, e-mail (nataliamg.1511@gmail.com), WhatsApp (+55 41 98532-4358), com ícone/label de cada canal.
   - Hierarquia: peso secundário ao formulário, mas visível sem scroll adicional (mesma dobra ou logo abaixo) — para quem prefere contato direto a preencher form.
   - Interação: links abrem app nativo (mailto:, wa.me, linkedin.com) em nova aba/app.

5. **Footer** (padrão).

**Atrito possível:** formulário sem confirmação visual gera reenvio duplicado ou abandono por incerteza. Mitigação: estado de sucesso explícito pós-envio (ver seção 6).

---

### 2.5 `/admin` — Login

**Objetivo da página:** autenticar a única usuária (Natália) de forma simples, sem jargão técnico.

**Blocos:**

1. **Formulário de login**
   - Campos: E-mail, Senha, botão "Entrar".
   - Hierarquia: único elemento da página — sem distrações, sem link de "criar conta" (não existe autocadastro).
   - Interação: erro de credencial mostra mensagem simples ("E-mail ou senha incorretos.") sem detalhe técnico de erro do Supabase.
   - Sem "esqueci minha senha" self-service complexo nesta fase — pode usar o fluxo padrão de reset por e-mail do Supabase Auth com uma tela simples, já que é baixo risco (usuário único).

**Atrito possível:** usuária esquecer senha e travar no acesso ao próprio site. Mitigação: link "Esqueci minha senha" sempre visível, mesmo sendo usuário único.

---

### 2.6 `/admin/projetos` — Lista de projetos

**Objetivo da página:** dar visão geral de tudo que está publicado/rascunho e permitir reordenar e publicar/despublicar sem sair da lista.

**Blocos:**

1. **Barra superior admin** (persiste em todo `/admin/*`)
   - Conteúdo: nome do site/admin, nav lateral ou superior simples: "Projetos" · "Sobre" · "Mensagens" · "Sair".
   - Hierarquia: baixo peso, utilitário.

2. **Cabeçalho da página + CTA principal**
   - Conteúdo: título "Projetos" + botão destacado "+ Novo projeto" (leva a `/admin/projetos/novo`).
   - Hierarquia: CTA "+ Novo projeto" é o elemento de maior peso da página — é a ação mais frequente da usuária.

3. **Lista/tabela de projetos**
   - Conteúdo por linha: thumbnail pequena, título, categoria, ano, status (badge "Publicado"/"Rascunho"), ações (Editar, Publicar/Despublicar, Excluir).
   - Hierarquia: linha inteira clicável leva para editar; badge de status com contraste claro (visual fica a cargo do UI Designer, mas a intenção é status ser reconhecível "sem ler", só pela cor/forma).
   - Interação: **arrastar para reordenar** (drag handle em cada linha) — atualiza `display_order` direto; toggle rápido de publicar/despublicar sem precisar entrar na edição completa (reduz clique).
   - Atrito possível: reordenar por arraste pode confundir usuária pouco técnica. Mitigação: alternativa com setas ↑/↓ por linha, sem exigir drag-and-drop como única via.

**Atrito possível:** publicar projeto incompleto por engano. Mitigação: campo obrigatório mínimo (título, capa, categoria) bloqueia publicação até estar preenchido; regra confirmada com o Product/Dev na implementação.

---

### 2.7 `/admin/projetos/novo` e `/admin/projetos/[id]` — Criar/editar projeto

**Objetivo da página:** permitir que a Natália cadastre ou edite um case completo sem ajuda técnica, num fluxo linear e não intimidador.

**Blocos (formulário em seções, não campos soltos):**

1. **Barra superior admin** (padrão) + breadcrumb "Projetos / Novo projeto" ou "Projetos / [título]".

2. **Seção "Informações básicas"**
   - Campos: Título*, Slug (gerado automaticamente do título, editável), Categoria*, Ano*, Cliente (opcional).
   - Hierarquia: primeira seção do formulário — dados que aparecem no card do grid.

3. **Seção "Imagens do card"**
   - Campos: Imagem de capa* (upload), Imagem de hover (upload) — com preview lado a lado simulando o efeito de troca no hover.
   - Hierarquia: preview visual grande — usuária não-técnica precisa "ver" o resultado antes de salvar.
   - Interação: preview ao vivo do hover ao passar o mouse sobre a prévia do card.

4. **Seção "Conteúdo do case"**
   - Campos estruturados (não um textarea único): Contexto do cliente, O desafio, A solução criativa, O resultado — cada um como campo de texto próprio, curto, com placeholder de exemplo.
   - Hierarquia: seção mais longa da página, mas quebrada em blocos pequenos para não intimidar.
   - Justificativa: campos separados (em vez de um markdown livre) reduzem a chance de a usuária esquecer de contar o "porquê" do case — requisito direto do briefing (ICP secundário exige racional, não só peça).

5. **Seção "Galeria"**
   - Campo: upload múltiplo de imagens, com possibilidade de reordenar (mesma lógica de setas ↑/↓ da lista de projetos).
   - Hierarquia: peso visual alto (thumbnails grandes), pois define a experiência da página de case.

6. **Seção "Publicação"**
   - Campo: toggle "Publicado" / "Rascunho".
   - Hierarquia: destacado, geralmente fixo no topo ou rodapé do formulário (sticky), para a usuária sempre saber o estado atual sem rolar.

7. **Ações finais**
   - Botões: "Salvar rascunho", "Salvar e publicar", "Cancelar".
   - Interação: autosave opcional (nice-to-have, não obrigatório nesta fase) reduz risco de perda de conteúdo digitado.

**Atrito possível:** formulário longo assusta usuária não-técnica. Mitigação: seções colapsáveis/com progresso visual e linguagem 100% em português simples (nunca "slug", por exemplo — usar "Endereço da página" com o slug técnico gerado por baixo).

---

### 2.8 `/admin/sobre` — Editar Sobre

**Objetivo da página:** editar bio e foto sem precisar entender de campos técnicos.

**Blocos:**

1. **Barra superior admin** (padrão).
2. **Campo de foto**: upload com preview igual ao que aparece no site público.
3. **Campo "Quem é a Nat?"**: textarea com o texto principal da bio.
4. **Campo "Um relacionamento"**: textarea com o texto complementar.
5. **Campo "Clientes/marcas atendidas"**: lista editável (adicionar/remover item).
6. **Campo "Ferramentas/IAs"**: lista editável (adicionar/remover item).
7. **Campo "Link do currículo"**: campo de URL (Google Drive).
8. **Botão "Salvar alterações"**.

Hierarquia: cada campo mapeia 1:1 para um bloco visível em `/sobre`, na mesma ordem — reduz carga cognitiva (o que ela vê no admin é o que aparece no site, na mesma sequência).

---

### 2.9 `/admin/mensagens` — Mensagens recebidas

**Objetivo da página:** permitir que a Natália veja e acompanhe quem entrou em contato pelo formulário.

**Blocos:**

1. **Barra superior admin** (padrão).
2. **Lista de mensagens**
   - Conteúdo por item: nome, e-mail, data/hora de envio, prévia da mensagem, indicador de lida/não lida.
   - Hierarquia: mensagens não lidas com maior destaque (negrito ou marcador), ordenadas da mais recente para a mais antiga.
   - Interação: clique expande/abre a mensagem completa; marcar como lida automaticamente ao abrir.
3. **Estado vazio**: ver seção 6.

**Atrito possível:** mensagem importante perdida entre várias. Mitigação: contador de não lidas na nav lateral do admin (badge), status "lida/não lida" persistente.

---

## 3. Fluxos críticos

### Fluxo 1 — Visitante avalia portfólio → contato
```
Home (/) 
  → lê hero, entende quem é a Natália
  → rola até grid de projetos
  → clica em um card (ex: #100vezesMaxim)
  → /projetos/100vezesmaxim
  → lê contexto/desafio/solução/resultado, vê prêmio ADVB/PR
  → (opcional) navega para próximo case via link Próximo/Anterior
  → volta ao header, clica "Sobre"
  → /sobre — confirma clientes/contas atendidas + baixa currículo
  → clica "Contato"
  → /contato — preenche Nome/E-mail/Mensagem → "Enviar →"
  → vê estado de sucesso na própria página
```

### Fluxo 2 — Recrutador direto ao ponto (sem passar por Sobre)
```
Home (/)
  → grid de projetos
  → abre 2-3 cases em sequência (via nav Próximo/Anterior dentro do case)
  → decide contato direto por WhatsApp/LinkedIn (sem usar formulário)
  → /contato → clica no link de WhatsApp → abre conversa direta
```
Justificativa: por isso os contatos diretos ficam visíveis em `/contato` mesmo com formulário — nem todo avaliador de agência quer preencher form.

### Fluxo 3 — Natália publica um case novo
```
/admin (login)
  → /admin/projetos (lista atual)
  → clica "+ Novo projeto"
  → /admin/projetos/novo
  → preenche Informações básicas → Imagens do card → Conteúdo do case → Galeria
  → deixa como "Rascunho" e clica "Salvar rascunho" (pode revisar depois)
  → volta em outro momento, reabre /admin/projetos/[id]
  → revisa, ativa toggle "Publicado"
  → clica "Salvar e publicar"
  → projeto aparece imediatamente no grid da Home pública
```

### Fluxo 4 — Natália reordena cases por relevância
```
/admin/projetos
  → usa setas ↑/↓ (ou arraste) para subir o case premiado (#100vezesMaxim) ao topo
  → ordem é salva automaticamente
  → Home pública reflete a nova ordem no próximo carregamento
```

---

## 4. Decisões de estrutura (com justificativa)

1. **Navegação fixa no topo (header sticky), não sidebar, no site público.**
   Justificativa: fidelidade obrigatória à referência bitagoli.com; portfólio de redator é conteúdo de leitura vertical longa (cases com scroll extenso) — sidebar competiria por espaço horizontal sem necessidade, já que a navegação pública tem só 3 itens (Projetos/Sobre/Contato).

2. **Sidebar/nav simples no admin, não replicar o header público.**
   Justificativa: admin é uma ferramenta de trabalho, não uma vitrine — prioriza acesso rápido às 3 áreas (Projetos, Sobre, Mensagens) sempre visíveis, sem exigir voltar a uma "home" do admin.

3. **Sem página de Pricing/planos** (não se aplica — não é produto SaaS).

4. **FAQ: não existe nesta entrega.**
   Justificativa: fora de escopo do briefing; o público-alvo (recrutadores/diretores de criação) não tem dúvidas de "como funciona um portfólio" — não há atrito de entendimento de produto a resolver com FAQ.

5. **Login admin em página dedicada (`/admin`), não modal.**
   Justificativa: é acesso restrito e pouco frequente (uso diário só pela Natália); página dedicada é mais simples de proteger via middleware de rota e mais clara para usuária não-técnica do que um modal sobre o site público.

6. **Contato como página dedicada (`/contato`), não modal nem seção da Home.**
   Justificativa: briefing pede página própria explicitamente; além disso, formulário com 3 campos obrigatórios pede espaço de leitura tranquila, e a página também carrega os contatos diretos (LinkedIn/e-mail/WhatsApp), conteúdo demais para um modal.

7. **Conteúdo do case estruturado em campos fixos (cliente/desafio/solução/resultado), não um editor de texto livre único.**
   Justificativa: é a decisão mais importante de UX do projeto. O ICP secundário (diretores de criação/recrutadores) julga precisamente se há "racional estratégico" por trás da peça — campos fixos no admin *forçam* esse racional a existir sempre, em vez de depender da disciplina da usuária ao escrever num campo livre.

8. **Ordem de exibição do grid controlada manualmente (display_order), não por data de criação.**
   Justificativa: briefing explicita que o prêmio ADVB/PR e contas de peso (Prefeitura, DETRAN) "precisam ser apresentadas com destaque, não diluídas num grid genérico" — ordenação manual dá à Natália controle editorial sobre o que abre o portfólio.

9. **Publicar/despublicar como estado binário simples (não "agendar publicação"), nesta fase.**
   Justificativa: escopo da primeira entrega não pede agendamento; manter simples reduz superfície de erro para usuária não-técnica. Pode evoluir depois.

10. **Sem breadcrumb complexo no site público; breadcrumb simples só no admin.**
    Justificativa: site público tem profundidade rasa (no máximo 1 nível: `/projetos/[slug]`), header com nav já resolve orientação. Admin tem mais telas aninhadas (lista → editar) e usuária não-técnica se beneficia de saber "onde estou".

---

## 5. Modelo de dados sugerido (Supabase)

### Tabela `projects`
| Campo | Tipo | Observação |
|---|---|---|
| id | uuid (PK) | |
| title | text | |
| slug | text (unique) | gerado do título, editável |
| category | text | |
| year | int | |
| client | text (nullable) | opcional |
| award | text (nullable) | ex: "Top of Marketing ADVB/PR" |
| cover_image_url | text | Supabase Storage |
| hover_image_url | text (nullable) | Supabase Storage |
| context_text | text | "Contexto do cliente" |
| challenge_text | text | "O desafio" |
| solution_text | text | "A solução criativa" |
| result_text | text | "O resultado" |
| status | enum(`draft`,`published`) | default `draft` |
| display_order | int | usado para ordenar grid e navegação próximo/anterior |
| created_at / updated_at | timestamptz | |

### Tabela `project_gallery_images`
| Campo | Tipo | Observação |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects.id) | |
| image_url | text | Supabase Storage |
| display_order | int | ordem dentro da galeria do case |

*Decisão: galeria em tabela própria (não JSON dentro de `projects`) para facilitar reordenar/adicionar/remover itens individualmente via admin sem reescrever o objeto inteiro — mais simples de implementar CRUD incremental.*

### Tabela `about` (linha única, singleton)
| Campo | Tipo | Observação |
|---|---|---|
| id | uuid (PK) | sempre 1 registro |
| photo_url | text | Supabase Storage |
| bio_main_text | text | "Quem é a Nat?" |
| bio_secondary_text | text | "Um relacionamento" |
| clients | text[] (ou JSON array) | lista de clientes/marcas |
| tools | text[] (ou JSON array) | lista de ferramentas/IAs |
| resume_url | text | link externo (Google Drive) |
| updated_at | timestamptz | |

### Tabela `messages`
| Campo | Tipo | Observação |
|---|---|---|
| id | uuid (PK) | |
| name | text | |
| email | text | |
| message | text | |
| is_read | boolean | default false |
| created_at | timestamptz | |

### Tabela `contact_links` (opcional — ou hardcoded/env se não precisar editar via admin)
| Campo | Tipo | Observação |
|---|---|---|
| linkedin_url | text | |
| email | text | |
| whatsapp_number | text | |

*Nota: o briefing não pede edição desses links via admin nesta fase — podem viver na tabela `about` ou em configuração estática; decisão final cabe ao Dev/Product conforme simplicidade de implementação.*

### Auth
- Supabase Auth, 1 usuário provisionado manualmente (sem tela de signup pública).
- RLS: `projects`/`about` com leitura pública apenas para `status = published` (ou sempre pública para `about`); escrita restrita ao usuário autenticado. `messages`: insert público (via formulário), select/update restrito ao usuário autenticado.

---

## 6. Estados vazios, erro e loading

### Home — grid de projetos
- **Vazio** (nenhum projeto publicado): mensagem simples no lugar do grid, ex: "Novos projetos em breve." — nunca deixar a Home parecer quebrada.
- **Loading**: skeleton dos cards (retângulos com shimmer) no lugar do grid enquanto busca no Supabase.
- **Erro** (falha ao buscar dados): mensagem amigável + opção de recarregar; nunca expor erro técnico do Supabase ao visitante.

### `/projetos/[slug]`
- **Slug inexistente ou projeto despublicado**: página 404 própria do site (mantendo header/footer), com CTA "Voltar para projetos".
- **Loading**: skeleton do título + blocos de imagem.

### `/sobre`
- **Vazio** (conteúdo ainda não preenchido no admin): fallback com nome + cargo mínimo, nunca página em branco.

### `/contato`
- **Sucesso de envio**: mensagem de confirmação clara na própria página (ex: "Mensagem enviada! Retorno em breve.") — substitui ou soma ao formulário, sem redirecionar para outra página (mantém contexto).
- **Erro de envio** (falha de rede/Supabase): mensagem de erro específica próxima ao botão "Enviar →", com opção de tentar novamente; dados digitados não se perdem.
- **Validação**: erros inline por campo (Nome/E-mail/Mensagem) antes do submit, mensagens em português simples ("Preencha seu e-mail.").

### Admin — geral
- **Login inválido**: mensagem simples, sem detalhe técnico.
- **`/admin/projetos` vazio** (nenhum projeto cadastrado ainda): estado vazio com ilustração/texto + CTA grande "+ Criar primeiro projeto".
- **`/admin/mensagens` vazio**: texto simples "Nenhuma mensagem recebida ainda."
- **Loading em qualquer listagem admin**: skeleton de linhas/tabela.
- **Erro de salvamento em formulários admin**: mensagem clara próxima ao botão de salvar, formulário mantém os dados preenchidos (nunca perder o que a usuária digitou).
- **Confirmação de ações destrutivas**: excluir projeto ou despublicar sempre pede confirmação explícita (modal simples "Tem certeza?") — usuária não-técnica não deve conseguir apagar algo por engano com um único clique.

---

## 7. Regras de responsividade do grid (Home)

*(Intenção estrutural — breakpoints exatos e valores de espaçamento ficam a cargo do UI Designer.)*

- **Desktop (larga):** grid de múltiplas colunas (referência bitagoli.com usa 2-3 colunas) — thumbnails grandes, hover de troca de imagem funcional via mouse.
- **Tablet:** redução para 2 colunas, mantendo proporção de imagem consistente entre cards.
- **Mobile:** 1 coluna, cards empilhados verticalmente; efeito de hover não se aplica (sem mouse) — trocar para: capa estática, ou troca de imagem via toque/scroll-into-view (decisão de interação a refinar com UI Designer, mas a intenção UX é nunca depender de hover em touch).
- Header: nav de 3 itens pode colapsar em menu simples (não obrigatoriamente hambúrguer complexo — poucos itens permitem manter nav visível até telas bem pequenas; decisão final de componente é do UI Designer).
- Página de case (`/projetos/[slug]`): imagens grandes empilhadas já são mobile-first por natureza (comportamento igual em todos os tamanhos, só ajusta largura/margem).
- Admin: prioridade é desktop (ferramenta de trabalho), mas lista de projetos e formulários devem permanecer utilizáveis em tablet, já que a usuária pode revisar conteúdo fora do computador principal.

---

## 8. Rastreamento de atrito — resumo por página

| Página | Ponto de abandono provável | Mitigação aplicada |
|---|---|---|
| Home | Grid vazio ou lento | Estado vazio amigável + skeleton loading |
| Home | Visitante não entende quem é ela em 3s | Hero enxuto, 2 linhas + 1 CTA |
| /projetos/[slug] | Case parece "peça avulsa" sem racional | Campos estruturados obrigatórios de contexto/desafio/solução/resultado |
| /projetos/[slug] | Fim do case sem próximo passo | Nav Próximo/Anterior projeto |
| /sobre | Bio longa demais, perde quem só quer currículo | Blocos curtos, currículo em CTA destacado no fim |
| /contato | Incerteza se a mensagem foi enviada | Estado de sucesso explícito na página |
| /contato | Não gosta de formulário | Contatos diretos (WhatsApp/LinkedIn/e-mail) sempre visíveis |
| /admin/projetos/novo | Formulário longo intimida usuária não-técnica | Seções curtas, linguagem simples, salvar como rascunho a qualquer momento |
| /admin/projetos | Medo de reordenar/errar | Setas ↑/↓ como alternativa ao drag-and-drop |
| /admin (qualquer exclusão) | Apagar conteúdo por engano | Confirmação explícita em ações destrutivas |

---

*Fim do documento. Próxima etapa: UI Designer define sistema visual (cor, tipografia, espaçamento, componentes shadcn/ui, animações framer-motion) sobre esta arquitetura.*
