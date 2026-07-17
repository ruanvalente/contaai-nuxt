# Plano de Ação – Migração da rota `dashboard` para `discover`

Implemente a seguinte refatoração na estrutura de rotas da aplicação, seguindo boas práticas de organização, componentização e manutenção do projeto.

## Objetivo

A rota `dashboard` deixará de ser a página principal da aplicação. A partir desta implementação, a rota principal será `discover`, tornando-se o ponto de entrada do usuário após a autenticação.

---

## Histórico de Execução

### Fase 1 – Migração da rota principal e sub-rotas

**Status:** Concluída
**Duração:** ~8 minutos
**Data:** 2026-07-17

#### O que foi feito:

1. **Criação da estrutura de páginas `discover/`**
   - Criado `pages/discover/index.vue` (home autenticada, com Stats, QuickActions, BookGrid, CreateBookModal)
   - Criado `pages/discover/explore.vue` (exploração de livros com busca, categorias e scroll infinito)
   - Criado `pages/discover/my-session.vue` (favoritos e histórico de leitura)
   - Removida a pasta `pages/dashboard/` (rotas obsoletas)

2. **Atualização de redirects de autenticação**
   - `pages/auth/login.vue`: `router.push('/dashboard')` → `router.push('/discover')`
   - `pages/auth/register.vue`: `router.push('/dashboard')` → `router.push('/discover')`
   - `middleware/guest.ts`: `navigateTo('/dashboard')` → `navigateTo('/discover')`
   - `pages/index.vue`: `router.replace("/dashboard")` → `router.replace("/discover")`

3. **Atualização de configuração**
   - `nuxt.config.ts`: exclude `"/dashboard/explore"` → `"/discover/explore"`

4. **Atualização de componentes de navegação**
   - `components/dashboard/sidebar.vue`: todos os `navItems` apontam para `/discover/*`, label "Dashboard" → "Discover", lógica de `isActive` atualizada
   - `components/dashboard/header.vue`: logo link `/dashboard` → `/discover`
   - `components/dashboard/quick-actions.vue`: links `/dashboard/explore` e `/dashboard/my-session` → `/discover/explore` e `/discover/my-session`

5. **Atualização de componentes landing**
   - `components/landing/header.vue`: nav items `/dashboard/explore` e `/dashboard/my-session` → `/discover/*`
   - `components/landing/hero.vue`: botão Explorar `/dashboard/explore` → `/discover/explore`
   - `components/landing/books-showcase.vue`: link "Ver todos os livros" → `/discover/explore`

6. **Correção de bug pré-existente**
   - `my-session.vue`: `isLoading` (inexistente no composable) → `loading` (propriedade correta do `useAuthStore`)

#### Arquivos modificados (13):

| Arquivo                                      | Alteração                            |
| -------------------------------------------- | ------------------------------------ |
| `app/pages/discover/index.vue`               | Criado (migrado de dashboard)        |
| `app/pages/discover/explore.vue`             | Criado (migrado de dashboard)        |
| `app/pages/discover/my-session.vue`          | Criado (migrado de dashboard)        |
| `app/pages/dashboard/*`                      | Removidos (3 arquivos)               |
| `app/pages/auth/login.vue`                   | Redirect → /discover                 |
| `app/pages/auth/register.vue`                | Redirect → /discover                 |
| `app/pages/index.vue`                        | Redirect → /discover                 |
| `app/middleware/guest.ts`                    | Redirect → /discover                 |
| `nuxt.config.ts`                             | Supabase exclude → /discover/explore |
| `app/components/dashboard/sidebar.vue`       | Nav items → /discover/\*             |
| `app/components/dashboard/header.vue`        | Logo link → /discover                |
| `app/components/dashboard/quick-actions.vue` | Action links → /discover/\*          |
| `app/components/landing/header.vue`          | Nav links → /discover/\*             |
| `app/components/landing/hero.vue`            | Explore button → /discover/explore   |
| `app/components/landing/books-showcase.vue`  | Ver todos → /discover/explore        |

#### Verificação:

- `nuxt typecheck`: **0 erros novos** no `app/` (erros pré-existentes no `server/` relacionados a `Database` types ausente)
- Nenhuma referência restante a rotas `/dashboard` em código de navegação

---

### Fase 2 – Sidebar, páginas placeholder e rotas

**Status:** Concluída
**Duração:** ~5 minutos
**Data:** 2026-07-17

#### O que foi feito:

1. **Sidebar: novos itens de navegação**
   - Adicionados 4 novos itens ao `navItems` em `components/dashboard/sidebar.vue`:
     - Categorias → `/discover/categories` (ícone grid)
     - Minha Biblioteca → `/discover/library` (ícone library)
     - Downloads → `/discover/downloads` (ícone download)
     - Favoritos → `/discover/favorites` (ícone heart)
   - Adicionados os ícones SVG correspondentes para cada novo item

2. **Páginas placeholder criadas (5)**
   - `pages/discover/categories.vue` – layout dashboard, título + descrição placeholder
   - `pages/discover/library.vue` – layout dashboard, título + descrição placeholder
   - `pages/discover/downloads.vue` – layout dashboard, título + descrição placeholder
   - `pages/discover/favorites.vue` – layout dashboard, título + descrição placeholder
   - `pages/discover/settings.vue` – layout dashboard, título + descrição placeholder

3. **Supabase redirect exclude atualizado**
   - `nuxt.config.ts`: adicionadas `/discover/categories`, `/discover/library`, `/discover/downloads`, `/discover/favorites`, `/discover/settings` à lista `exclude`

#### Arquivos modificados/criados (7):

| Arquivo                                      | Alteração                               |
| -------------------------------------------- | --------------------------------------- |
| `app/components/dashboard/sidebar.vue`       | +4 nav items e 4 ícones SVG            |
| `app/pages/discover/categories.vue`          | Criado (placeholder)                    |
| `app/pages/discover/library.vue`             | Criado (placeholder)                    |
| `app/pages/discover/downloads.vue`           | Criado (placeholder)                    |
| `app/pages/discover/favorites.vue`           | Criado (placeholder)                    |
| `app/pages/discover/settings.vue`            | Criado (placeholder)                    |
| `nuxt.config.ts`                             | Supabase exclude +5 rotas              |

---

### Fase 3 – Header com menu dropdown

**Status:** Concluída
**Duração:** ~3 minutos
**Data:** 2026-07-17

#### O que foi feito:

1. **Menu dropdown no header**
   - `components/dashboard/header.vue`: área do usuário agora é um botão clicável com dropdown
   - Exibe nome do usuário e email no topo do dropdown
   - Link "Configurações da Conta" → `/discover/settings`
   - Botão "Sair" que emite evento `logout`
   - Dropdown fecha ao clicar fora ou ao selecionar uma opção

2. **Transições CSS**
   - Animação de fade para overlay de fechamento
   - Animação de slide+scale para abertura/fechamento do dropdown

3. **Propagação do evento logout**
   - `layouts/dashboard.vue`: `@logout` passado para `DashboardHeader` para que o menu dropdown do header funcione corretamente

#### Arquivos modificados (2):

| Arquivo                                      | Alteração                              |
| -------------------------------------------- | -------------------------------------- |
| `app/components/dashboard/header.vue`        | Menu dropdown com user info e logout   |
| `app/layouts/dashboard.vue`                  | @logout propagado para o header        |

#### Verificação:

- `nuxt typecheck`: **0 erros novos** no `app/`
- Estrutura de rotas final conferida:

```text
/discover
├── /discover/explore
├── /discover/my-session
├── /discover/categories
├── /discover/library
├── /discover/downloads
├── /discover/favorites
└── /discover/settings
```

---

## 1. Migração da rota principal ✅

- A rota `dashboard` deverá ser substituída por `discover`.
- Após o login, o usuário deverá ser redirecionado automaticamente para `/discover`.
- Toda referência existente para `/dashboard` deverá ser atualizada para `/discover`, evitando links quebrados ou navegação inconsistente.

---

## 2. Migração das sub-rotas ✅

Atualmente a rota `dashboard` possui as seguintes sub-rotas:

- `explore`
- `my-session`

Essas rotas deverão ser movidas para dentro de `discover`, resultando em uma estrutura semelhante a:

```text
/discover
/discover/explore
/discover/my-session
```

Atualize toda a navegação da aplicação para utilizar os novos caminhos.

---

## 3. Ações Rápidas ✅

Na tela principal do antigo `dashboard` existe um componente chamado **Ações Rápidas**, contendo os seguintes atalhos:

- Novo Livro
- Explorar
- Minha Sessão
- Estatísticas

Esse componente deverá ser mantido e exibido na página inicial de `discover`.

Todos os botões devem apontar para as novas rotas correspondentes.

---

## 4. Estrutura da Sidebar ✅

Todos os itens presentes na sidebar deverão passar a ser sub-rotas de `discover`.

Estrutura esperada:

```text
/discover
├── explore
├── my-session
├── categories
├── library
├── downloads
├── favorites
```

Os seguintes itens deverão estar disponíveis na navegação:

- Categorias
- Minha Biblioteca
- Downloads
- Favoritos

Caso existam referências para essas páginas fora da estrutura de `discover`, atualize-as para a nova organização.

---

## 5. Header da página Discover ✅

Atualize o header da página principal de `discover` para conter:

- Nome do usuário autenticado.
- Avatar (caso exista).
- Menu dropdown contendo:
  - Configurações da conta.
  - Logout.

O logout deverá reutilizar o fluxo de autenticação já existente na aplicação.

---

## 6. Rotas ainda não implementadas ✅

As páginas abaixo ainda não possuem conteúdo funcional:

- Categorias
- Minha Biblioteca
- Downloads
- Favoritos
- Configurações

Para cada uma delas:

- Criar a rota.
- Criar a página correspondente.
- Exibir apenas um layout simples contendo:
  - título da página;
  - uma breve descrição como:

> "Esta funcionalidade será implementada em breve."

Essas páginas devem utilizar o mesmo layout padrão da aplicação para facilitar futuras implementações.

---

## 7. Boas práticas

Durante a implementação:

- Não alterar funcionalidades existentes que não estejam relacionadas a esta migração.
- Manter a tipagem em TypeScript.
- Reutilizar componentes existentes sempre que possível.
- Evitar duplicação de código.
- Atualizar menus, breadcrumbs, links e navegação para refletirem a nova estrutura.
- Garantir que o sistema continue responsivo.
- Preservar o estado da aplicação e o fluxo de autenticação.
- Remover referências obsoletas à rota `dashboard`, caso não sejam mais utilizadas.

---

## Resultado esperado

Ao final da implementação:

- O login direciona o usuário para `/discover`.
- A página `discover` torna-se a nova home autenticada da aplicação.
- O componente **Ações Rápidas** continua funcionando normalmente.
- Todas as páginas da sidebar passam a fazer parte da estrutura de `discover`.
- O header apresenta corretamente o usuário autenticado e o menu de perfil.
- As rotas ainda não implementadas já estão preparadas com páginas placeholder para futuras funcionalidades.
- Toda a navegação da aplicação permanece consistente e sem links quebrados.
