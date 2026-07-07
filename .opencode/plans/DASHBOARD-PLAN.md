# Plano de Execução — Dashboard do Autor

> Documento de planejamento e tracking para implementação do Dashboard do Autor na plataforma ContaAI.
>
> **Status:** Em andamento 07/07/2026

---

## Fase 1 — Tipos e Configuração

### 1.1 Atualizar categorias (client)

**Arquivo:** `app/types/book.entity.ts`

- [x] Substituir `BookCategory` para categorias em português
- [x] Atualizar arrays `CATEGORIES` e `BOOK_CATEGORIES`

### 1.2 Atualizar categorias (server)

**Arquivo:** `server/domain/entities/book.entity.ts`

- [x] Mesma atualização de categorias do client

### 1.3 Criar tipos do dashboard

**Arquivo:** `app/types/dashboard.ts`

- [x] Criar interface `UserMetrics`
- [x] Criar interface `PlatformMetrics`
- [x] Criar interface `CreateBookPayload`
- [x] Criar constantes de cores predefinidas

---

## Fase 2 — API (Server)

### 2.1 Listar livros do usuário

**Arquivo:** `server/api/user/books/index.get.ts`

- [ ] GET `/api/user/books` — retorna livros do `user_books`

### 2.2 Criar livro do usuário

**Arquivo:** `server/api/user/books/index.post.ts`

- [ ] POST `/api/user/books` — insere na tabela `user_books`

### 2.3 Upload de capa

**Arquivo:** `server/api/user/books/cover.post.ts`

- [ ] POST `/api/user/books/cover` — upload com validação

### 2.4 Deletar livro

**Arquivo:** `server/api/user/books/[id].delete.ts`

- [ ] DELETE `/api/user/books/[id]`

### 2.5 Estatísticas do usuário

**Arquivo:** `server/api/user/stats.get.ts`

- [ ] GET `/api/user/stats` — métricas do usuário (publishedBooks/drafts reais, demais mock)

### 2.6 Estatísticas da plataforma

**Arquivo:** `server/api/platform/stats.get.ts`

- [ ] GET `/api/platform/stats` — métricas da plataforma (totalAuthors/totalBooks reais, demais mock)

---

## Fase 3 — Composables

### 3.1 useUserBooks

**Arquivo:** `app/composables/use-user-books.ts`

- [ ] Singleton com `books`, `isLoading`, `isCreating`, `error`, `isEmpty`
- [ ] Métodos: `fetchBooks()`, `createBook(payload)`, `deleteBook(id)`

### 3.2 useDashboard

**Arquivo:** `app/composables/use-dashboard.ts`

- [ ] Singleton com `userMetrics`, `platformMetrics`, `isLoading`, `error`
- [ ] Método: `fetchMetrics()`

### 3.3 useToast

**Arquivo:** `app/composables/use-toast.ts`

- [ ] Singleton com `toasts`, `success()`, `error()`, `info()`

---

## Fase 4 — Layout do Dashboard

### 4.1 dashboard.vue layout

**Arquivo:** `app/layouts/dashboard.vue`

- [ ] Header fixo + Sidebar + slot
- [ ] Sidebar lg:w-64, mobile drawer overlay
- [ ] Transições suaves
- [ ] SharedUiToast incluso

---

## Fase 5 — Componentes

### 5.1 DashboardHeader

**Arquivo:** `app/components/dashboard/header.vue`

- [ ] Logo + hamburger (mobile) + avatar + notificações placeholder

### 5.2 DashboardSidebar

**Arquivo:** `app/components/dashboard/sidebar.vue`

- [ ] Nav items: Dashboard, Explorar, Minha Sessão
- [ ] Logout, item ativo, mobile overlay

### 5.3 DashboardStats

**Arquivo:** `app/components/dashboard/stats.vue`

- [ ] Grid métricas usuário + plataforma, skeleton loading

### 5.4 DashboardBookCard

**Arquivo:** `app/components/dashboard/book-card.vue`

- [ ] Capa (cor/título ou imagem), status badge, categoria, data, ações (editar/excluir)

### 5.5 BookGrid

**Arquivo:** `app/components/dashboard/book-grid.vue`

- [ ] Grid responsivo, skeleton loading

### 5.6 EmptyBooks

**Arquivo:** `app/components/dashboard/empty-books.vue`

- [ ] Ilustração + texto + CTA "Criar Primeiro Livro"

### 5.7 CreateBookModal

**Arquivo:** `app/components/dashboard/create-book-modal.vue`

- [ ] Modal mobile/desktop, formulário completo, preview capa, validação, loading, toast

### 5.8 CategorySelect

**Arquivo:** `app/components/dashboard/category-select.vue`

- [ ] Dropdown categorias português, animado

### 5.9 CoverColorPicker

**Arquivo:** `app/components/dashboard/cover-color-picker.vue`

- [ ] Grid 16 cores, preview em tempo real

### 5.10 UploadCover

**Arquivo:** `app/components/dashboard/upload-cover.vue`

- [ ] Upload clique, preview, validação tipo/tamanho, remover

### 5.11 QuickActions

**Arquivo:** `app/components/dashboard/quick-actions.vue`

- [ ] Grid 2x2: Novo Livro, Explorar, Minha Sessão, Estatísticas (placeholder)

### 5.12 SharedUiToast

**Arquivo:** `app/components/shared/ui/toast.vue`

- [ ] Toast notifications com TransitionGroup

### 5.13 SharedUiSkeletonText

**Arquivo:** `app/components/shared/ui/skeleton-text.vue`

- [ ] Skeleton loading reutilizável

---

## Fase 6 — Página do Dashboard

### 6.1 dashboard.vue

**Arquivo:** `app/pages/dashboard.vue`

- [ ] Layout dashboard, middleware auth
- [ ] loading inicial, métricas, ações rápidas, grid/empty books
- [ ] Modal criação, delete com confirmação toast

---

## Fase 7 — Verificação

- [ ] TypeScript compila sem erros
- [ ] Componentes seguem padrões existentes
- [ ] Responsivo (mobile/tablet/desktop)

---

## Arquivos Criados (22)

| Arquivo                                           | Tipo       |
| ------------------------------------------------- | ---------- |
| `app/types/dashboard.ts`                          | Types      |
| `server/api/user/books/index.get.ts`              | API        |
| `server/api/user/books/index.post.ts`             | API        |
| `server/api/user/books/cover.post.ts`             | API        |
| `server/api/user/books/[id].delete.ts`            | API        |
| `server/api/user/stats.get.ts`                    | API        |
| `server/api/platform/stats.get.ts`                | API        |
| `app/composables/use-user-books.ts`               | Composable |
| `app/composables/use-dashboard.ts`                | Composable |
| `app/composables/use-toast.ts`                    | Composable |
| `app/layouts/dashboard.vue`                       | Layout     |
| `app/components/dashboard/header.vue`             | Component  |
| `app/components/dashboard/sidebar.vue`            | Component  |
| `app/components/dashboard/stats.vue`              | Component  |
| `app/components/dashboard/book-card.vue`          | Component  |
| `app/components/dashboard/book-grid.vue`          | Component  |
| `app/components/dashboard/empty-books.vue`        | Component  |
| `app/components/dashboard/create-book-modal.vue`  | Component  |
| `app/components/dashboard/category-select.vue`    | Component  |
| `app/components/dashboard/cover-color-picker.vue` | Component  |
| `app/components/dashboard/upload-cover.vue`       | Component  |
| `app/components/dashboard/quick-actions.vue`      | Component  |
| `app/components/shared/ui/toast.vue`              | Component  |
| `app/components/shared/ui/skeleton-text.vue`      | Component  |

## Arquivos Modificados (4)

| Arquivo                                 | Mudança                  |
| --------------------------------------- | ------------------------ |
| `app/types/book.entity.ts`              | Categorias PT            |
| `server/domain/entities/book.entity.ts` | Categorias PT            |
| `app/pages/dashboard.vue`               | Reescríta completa       |
| `app/layouts/dashboard.vue`             | Adicionado SharedUiToast |
