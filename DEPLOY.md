# Guia de publicação — Portfólio Natália Machado

Este guia é para a **Natália** (com apoio da Behave). São 3 blocos: GitHub → Vercel → Supabase.
Os blocos 1 e 2 colocam o site no ar com os dados de exemplo. O bloco 3 ativa o painel admin.

---

## 1. GitHub (guardar o código na sua conta)

1. Crie sua conta em https://github.com/signup (se ainda não tiver).
2. Crie um repositório novo em https://github.com/new
   - **Repository name:** `portfolio` (ou o nome que preferir)
   - Visibilidade: **Private** (recomendado)
   - **NÃO** marque nenhuma opção de inicialização (sem README, sem .gitignore) — o repositório precisa nascer vazio.
3. Adicione a Behave como colaboradora para o envio do código:
   - No repositório: **Settings → Collaborators → Add people**
   - Adicione o usuário: **`behaveinteligencia-cell`**
4. Avise a Behave e envie o link do repositório (ex.: `https://github.com/SEU-USUARIO/portfolio`).
   A Behave fará o push do código completo.

---

## 2. Vercel (colocar o site no ar)

Faça depois que o código estiver no GitHub (passo 1 concluído).

1. Crie sua conta em https://vercel.com/signup — escolha **"Continue with GitHub"** e entre com a mesma conta do passo 1.
2. Acesse https://vercel.com/new — seu repositório `portfolio` aparecerá na lista. Clique em **Import**.
3. Não mude nada nas configurações (a Vercel detecta Next.js sozinha). Clique em **Deploy**.
4. Em ~2 minutos o site estará no ar em um endereço `https://portfolio-xxxx.vercel.app`.
   - O site já funciona por completo com os projetos de exemplo; o painel `/admin` fica desativado até o bloco 3.
5. (Opcional) Domínio próprio: no projeto da Vercel, **Settings → Domains** e siga as instruções do seu provedor de domínio.

---

## 3. Supabase (ativar o painel admin)

O passo a passo detalhado está no arquivo `CLAUDE.md` deste repositório (seção sobre conectar o Supabase). Resumo:

1. Crie conta gratuita em https://supabase.com e um projeto novo (região **South America — São Paulo**).
2. No **SQL Editor**, rode o conteúdo de `supabase/migrations/0001_initial.sql` e depois `supabase/seed.sql`.
3. Em **Authentication → Users → Add user**, crie seu usuário de login do admin (e-mail + senha).
4. Copie em **Settings → API**: a **Project URL** e a **anon/publishable key**.
5. Na Vercel: projeto → **Settings → Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key
6. Vercel → **Deployments → ⋯ → Redeploy**. Pronto: acesse `/admin`, entre com seu usuário e gerencie projetos, página Sobre e mensagens.

> Importante: com o Supabase conectado, o site passa a mostrar o conteúdo do banco (que começa igual ao de exemplo, via seed). A partir daí, toda edição é pelo `/admin` — inclusive a troca das imagens placeholder pelas peças reais das campanhas.
