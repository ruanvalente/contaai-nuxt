# Conta.AI - Plataforma de Biblioteca Digital

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-4.4.8-black?style=for-the-badge&logo=nuxt" alt="Nuxt">
  <img src="https://img.shields.io/badge/Vue-3.5-blue?style=for-the-badge&logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-cyan?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/TypeScript-6.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Bun-FEZF2A?style=for-the-badge&logo=bun" alt="Bun">
</p>

---

## 📋 Índice

1. [Sobre o Projeto](#sobre-o-projeto)
2. [Objetivo](#objetivo)
3. [Tecnologias](#tecnologias)
4. [Arquitetura do Projeto](#arquitetura-do-projeto)
5. [Modelo de Banco de Dados](#modelo-de-banco-de-dados)
6. [Funcionalidades](#funcionalidades)
7. [Configuração do Ambiente](#configuração-do-ambiente)
8. [Scripts Disponíveis](#scripts-disponíveis)
9. [Estilos e Design](#estilos-e-design)
10. [Contribuição](#contribuição)
11. [Licença](#licença)

---

## 📖 Sobre o Projeto

**Conta.AI** é uma aplicação web moderna para compartilhamento de contos, histórias e descoberta de novos autores, desenvolvida com Nuxt 4 e Vue 3. A plataforma oferece uma experiência rica com sistema de favoritagem, categorização e a possibilidade de explorar obras literárias de forma simples e gratuita.

O projeto segue uma arquitetura baseada em Clean Architecture no backend, com separação clara entre domínio, infraestrutura e casos de uso, e componentes Vue organizados por responsabilidade.

---

## 🎯 Objetivo

O objetivo principal do Conta.AI é fornecer uma plataforma intuitiva e elegante para:

- **Descoberta de Livros**: Navegar por uma coleção diversificada de livros categorizados
- **Favoritos**: Marcar e gerenciar livros favoritos
- **Sessão do Usuário**: Visualizar favoritos e histórico de leitura
- **Exploração**: Buscar e filtrar obras por categoria
- **Criação de Conteúdo**: Publicar histórias (em desenvolvimento)
- **Experiência Social**: Conectar leitores e autores

---

## 🛠 Tecnologias

### Core

| Tecnologia     | Versão | Descrição                        |
| -------------- | ------ | -------------------------------- |
| **Nuxt**       | 4.4.8  | Framework Vue com file-based routing |
| **Vue**        | 3.5.x  | Framework de UI progressivo      |
| **Vue Router** | 5.x    | Roteamento oficial               |
| **TypeScript** | 6.x    | Tipagem estática                 |
| **Bun**        | -      | Package manager e runtime        |

### Frontend

| Tecnologia            | Versão | Descrição               |
| --------------------- | ------ | ----------------------- |
| **Tailwind CSS**      | 3.x    | Framework de estilização |
| **Google Fonts**      | -      | Tipografia (Inter + Playfair Display) |

### Backend / Dados

| Tecnologia   | Descrição                                |
| ------------ | ---------------------------------------- |
| **Supabase** | Backend-as-a-Service (PostgreSQL + Auth) |
| **Composables** | Gerenciamento de estado via Vue composables |

### Ferramentas de Desenvolvimento

| Tecnologia  | Descrição                |
| ----------- | ------------------------ |
| **vue-tsc** | Type checking de Vue     |
| **PostCSS** | Processador de CSS       |

---

## 🏗 Arquitetura do Projeto

### Estrutura de Pastas

```
contaai-nuxt/
├── app/                        # Nuxt file-based routing
│   ├── app.vue                # Root component
│   ├── layouts/               # Layouts
│   │   └── default.vue       # Layout padrão
│   ├── pages/                 # Páginas (file-based routing)
│   │   ├── index.vue         # Landing page (pública)
│   │   ├── explore.vue       # Explorar obras
│   │   ├── my-session.vue    # Sessão do usuário
│   │   └── auth/             # Autenticação
│   │       ├── login.vue
│   │       ├── register.vue
│   │       └── forgot-password.vue
│   ├── components/            # Componentes Vue (auto-importados)
│   │   ├── landing/          # Componentes da landing page
│   │   ├── book-details/     # Componentes de detalhes do livro
│   │   └── shared/           # Componentes reutilizáveis
│   │       └── ui/           # Componentes visuais puros
│   ├── composables/           # Composables (stores + hooks)
│   │   ├── use-auth-store.ts
│   │   ├── use-books.ts
│   │   ├── use-favorites.ts
│   │   ├── use-author-follow.ts
│   │   └── use-anonymous-session.ts
│   ├── types/                 # Tipos TypeScript
│   │   └── book.entity.ts
│   └── utils/                 # Utilitários
│       └── supabase/
│           ├── client.ts
│           ├── server.ts
│           └── middleware.ts
│
├── server/                    # Camada de servidor (Clean Architecture)
│   ├── api/                   # API routes (Nuxt server routes)
│   │   ├── auth/             # Auth endpoints
│   │   ├── books/            # Books endpoints
│   │   └── user/             # User endpoints
│   ├── domain/                # Regras de negócio (core)
│   │   ├── entities/         # Entidades (Book, User, Favorite, etc.)
│   │   ├── repositories/     # Interfaces abstratas
│   │   └── usecases/         # Casos de uso
│   └── infrastructure/       # Implementações externas
│       ├── database/         # Repositórios Supabase
│       ├── mappers/          # Data mappers
│       └── storage/          # Storage Supabase
│
├── assets/                    # Arquivos de assets
│   └── css/
│       └── main.css          # Estilos globais
│
├── public/                    # Arquivos estáticos
├── nuxt.config.ts             # Configuração do Nuxt
├── tailwind.config.ts         # Configuração do Tailwind
└── tsconfig.json              # Configuração do TypeScript
```

### Padrões Arquiteturais

#### 1. Clean Architecture (Backend)

O projeto segue Clean Architecture na camada `server/`:

```
server/
├── domain/             # Regras de negócio (core)
│   ├── entities/      # Entidades (Book, User, Favorite, etc.)
│   └── repositories/  # Interfaces abstratas
├── infrastructure/    # Implementações externas
│   ├── database/      # Repositórios Supabase
│   ├── mappers/       # Data mappers
│   └── storage/       # Storage
└── api/               # Casos de uso expostos via API
```

**Benefícios:**
- Baixo acoplamento (dependency inversion)
- Testabilidade (mock de repositórios)
- Separação clara de responsabilidades

#### 2. Composables (State Management)

- **Composables** para estado compartilhado e lógica reutilizável
- `useState` para estado reativo global
- Composables específicos por domínio (`useBooks`, `useFavorites`, `useAuthStore`)

#### 3. Componentes

- **Auto-importados** pelo Nuxt (sem imports manuais)
- Componentes puramente visuais em `shared/ui/`
- Componentes de domínio em pastas nomeadas (`landing/`, `book-details/`)
- Prefixed components com `SharedUi` (ex: `SharedUiBookCard`)

#### 4. Server Routes (API)

- Endpoints em `server/api/` com file-based routing
- Handlers como `defineEventHandler()` para cada rota
- Separação por domínio (`auth/`, `books/`, `user/`)

#### 5. Tipagem

- Tipos compartilhados entre frontend e backend via `app/types/`
- Mappers para converter dados da API (snake_case) para o frontend (camelCase)
- Entidades de domínio em `server/domain/entities/`

---

## 💾 Modelo de Banco de Dados

O banco de dados é baseado em PostgreSQL (via Supabase) e segue o schema definido nas migrações.

### Tabelas Principais

#### 1. `books` - Catálogo de Livros

| Coluna         | Tipo         | Descrição               |
| -------------- | ------------ | ----------------------- |
| `id`           | UUID         | Chave primária          |
| `title`        | TEXT         | Título do livro         |
| `author`       | TEXT         | Autor                   |
| `cover_url`    | TEXT         | URL da capa             |
| `cover_color`  | TEXT         | Cor de fallback da capa |
| `description`  | TEXT         | Descrição               |
| `category`     | TEXT         | Categoria               |
| `pages`        | INTEGER      | Número de páginas       |
| `rating`       | DECIMAL(2,1) | Nota média              |
| `rating_count` | INTEGER      | Contagem de avaliações  |
| `review_count` | INTEGER      | Contagem de reviews     |
| `created_at`   | TIMESTAMPTZ  | Data de criação         |
| `updated_at`   | TIMESTAMPTZ  | Data de atualização     |

**RLS**: Leitura pública, inserção autenticada

---

#### 2. `profiles` - Perfis de Usuário

| Coluna       | Tipo        | Descrição           |
| ------------ | ----------- | ------------------- |
| `id`         | UUID        | FK para auth.users  |
| `name`       | TEXT        | Nome do usuário     |
| `avatar_url` | TEXT        | URL do avatar        |
| `bio`        | TEXT        | Biografia do usuário |
| `created_at` | TIMESTAMPTZ | Data de criação     |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

**RLS**: Leitura pública, atualização apenas pelo próprio usuário

**Trigger**: Criação automática na inscrição (`handle_new_user`)

---

#### 3. `ratings` - Avaliações e Reviews

| Coluna       | Tipo        | Descrição          |
| ------------ | ----------- | ------------------ |
| `id`         | UUID        | Chave primária     |
| `book_id`    | UUID        | FK para books      |
| `user_id`    | UUID        | FK para auth.users |
| `rating`     | INTEGER     | Nota (1-5)         |
| `review`     | TEXT        | Review textual     |
| `created_at` | TIMESTAMPTZ | Data de criação    |

**Constraints**: UNIQUE(book_id, user_id), CHECK(rating 1-5)

---

#### 4. `user_books` - Livros do Usuário (Criação)

| Coluna             | Tipo        | Descrição                                  |
| ------------------ | ----------- | ------------------------------------------ |
| `id`               | UUID        | Chave primária                             |
| `user_id`          | UUID        | FK para auth.users                         |
| `title`            | TEXT        | Título                                     |
| `author`           | TEXT        | Autor                                      |
| `cover_url`        | TEXT        | URL da capa                                |
| `cover_color`      | TEXT        | Cor de fallback                            |
| `content`          | TEXT        | Conteúdo do livro                           |
| `content_url`      | TEXT        | URL do conteúdo (para downloads)           |
| `status`           | TEXT        | Status (draft/published)                  |
| `reading_status`   | TEXT        | Status de leitura (none/reading/completed)|
| `reading_progress` | INTEGER     | Progresso em %                            |
| `category`         | TEXT        | Categoria                                  |
| `word_count`       | INTEGER     | Contagem de palavras                       |
| `pages`            | INTEGER     | Número de páginas                         |
| `created_at`       | TIMESTAMPTZ | Data de criação                            |
| `updated_at`       | TIMESTAMPTZ | Data de atualização                       |
| `published_at`     | TIMESTAMPTZ | Data de publicação                       |

**RLS**:

- Usuários gerenciam próprios livros
- Livros publicados são visíveis a todos

---

#### 5. `book_reading_progress` - Progresso de Leitura

| Coluna             | Tipo        | Descrição                |
| ------------------ | ----------- | ------------------------ |
| `id`               | UUID        | Chave primária           |
| `user_id`          | UUID        | FK para auth.users       |
| `book_id`          | UUID        | FK para user_books       |
| `current_position` | JSONB       | Posição atual de leitura  |
| `progress_percent` | INTEGER     | Progresso em %           |
| `started_at`       | TIMESTAMPTZ | Início da leitura        |
| `finished_at`      | TIMESTAMPTZ | Término da leitura       |

**Constraints**: UNIQUE(user_id, book_id)
**RLS**: Apenas o próprio usuário

---

#### 6. `user_favorites` - Livros Favoritos

| Coluna             | Tipo        | Descrição              |
| ------------------ | ----------- | ---------------------- |
| `id`               | UUID        | Chave primária         |
| `user_id`          | UUID        | FK para auth.users     |
| `book_id`          | UUID        | ID do livro favoritado |
| `book_title`       | TEXT        | Título do livro        |
| `book_author`      | TEXT        | Autor do livro         |
| `book_cover_color` | TEXT        | Cor da capa            |
| `book_cover_url`   | TEXT        | URL da capa            |
| `book_category`    | TEXT        | Categoria              |
| `created_at`       | TIMESTAMPTZ | Data que favoritou     |

**Constraints**: UNIQUE(user_id, book_id)
**RLS**: Apenas o próprio usuário visualiza/gerencia

---

#### 7. `author_follow` - Seguimento de Autores

| Coluna             | Tipo        | Descrição             |
| ------------------ | ----------- | --------------------- |
| `id`               | UUID        | Chave primária       |
| `follower_id`      | UUID        | FK para auth.users    |
| `author`           | TEXT        | Nome do autor        |
| `author_avatar_url`| TEXT        | URL do avatar        |
| `created_at`       | TIMESTAMPTZ | Data que seguiu      |

**Constraints**: UNIQUE(follower_id, author)
**RLS**: Apenas o próprio usuário gerencia

---

#### 8. `user_downloads` - Downloads do Usuário

| Coluna             | Tipo        | Descrição           |
| ------------------ | ----------- | --------------------- |
| `id`               | UUID        | Chave primária       |
| `user_id`          | UUID        | FK para auth.users   |
| `book_id`          | UUID        | FK para user_books |
| `created_at`       | TIMESTAMPTZ | Data do download   |

**Constraints**: UNIQUE(user_id, book_id)

---

### Índices de Performance

Diversos índices foram criados para otimizar consultas frequentes:

```sql
-- Books
idx_books_category ON books(category)
idx_books_author ON books(author)
idx_books_rating ON books(rating DESC)

-- User Books
idx_user_books_user_id ON user_books(user_id)
idx_user_books_status ON user_books(status)
idx_user_books_reading_status ON user_books(reading_status)
idx_user_books_category ON user_books(category)

-- Ratings
idx_ratings_book_id ON ratings(book_id)
idx_ratings_user_id ON ratings(user_id)

-- Reading Progress
idx_reading_progress_user_id ON book_reading_progress(user_id)
idx_reading_progress_book_id ON book_reading_progress(book_id)

-- Favorites
idx_user_favorites_user_id ON user_favorites(user_id)

-- Author Follow
idx_author_follow_follower_id ON author_follow(follower_id)
```

---

### Visões (Views)

#### `unified_books_view`

Une books (catálogo) e user_books (criação do usuário) em uma única visão para consultas generalizadas.

---

## ✨ Funcionalidades

### Autenticação

- Login/Registro via Supabase Auth
- Gerenciamento de perfil
- Avatar e bio do usuário
- Recuperação de senha

### Descoberta de Livros

- Landing page com showcase de livros
- Catálogo público de livros
- Busca por título e autor
- Filtragem por categoria
- Ordenação por rating

### Favoritos

- Adicionar/remover favoritos
- Lista de favoritos do usuário

### Sessão do Usuário

- Visualização de favoritos
- Histórico de leitura

### Seguir Autores

- Follow/unfollow de autores
- Feed de autores seguidos

### API

- Endpoints REST em `server/api/`
- Autenticação via Supabase
- Validação de dados

---

## ⚙️ Configuração do Ambiente

### 1. Pré-requisitos

- Node.js 18+ ou Bun
- Conta no Supabase (https://supabase.com)

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-service-role
SUPABASE_SERVICE_KEY=sua-chave-service-role

# Público (exposto ao client)
NUXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 3. Configuração do Banco

Execute as migrações do Supabase:

```bash
# Usando Supabase CLI
supabase db push

# Ou apply manualmente os arquivos de migração
```

### 4. Instalação de Dependências

```bash
# Com Bun (recomendado)
bun install

# Ou npm/yarn/pnpm
npm install
```

### 5. Executando o Projeto

```bash
# Desenvolvimento
bun run dev

# Build de produção
bun run build

# Preview de produção
bun run preview
```

---

## 📜 Scripts Disponíveis

| Script             | Descrição                            |
| ------------------ | ------------------------------------ |
| `bun run dev`      | Inicia o servidor de desenvolvimento |
| `bun run build`    | Gera build de produção               |
| `bun run preview`  | Preview do build de produção         |
| `bun run generate` | Gera site estático                   |
| `bun run postinstall` | Prepara ambiente Nuxt             |

---

## 🎨 Estilos e Design

### Tailwind CSS v3

O projeto utiliza Tailwind CSS v3 com PostCSS para estilização. Configuração em `tailwind.config.ts` com cores personalizadas:

- **primary**: Tons terrosos (#F5F0EB, #EDE6DC, #E0D6C8)
- **accent**: Dourado/madeira (#C9A87C, #B8956A, #A07D5A)

### Tipografia

Fontes configuradas via módulo `@nuxtjs/google-fonts`:

- **Inter** (sans-serif): Textos corridos e UI
- **Playfair Display** (serif): Títulos e display

### Tema de Leitura

Suporte a modo de leitura com variáveis CSS customizadas:

- Tamanho de fonte ajustável
- Modo noturno (night mode) para leitura
- Background e foreground customizáveis

### Componentes de Design

O projeto segue um sistema de design com:

- **UI Components**: Botões, inputs, cards, badges (em `shared/ui/`)
- **Landing Components**: Header, hero, showcase de livros
- **Book Components**: Modal de detalhes, painel de informações
- **Design Tokens**: Cores, fontes, spacing via Tailwind config

---

## 🤝 Contribuição

### Fluxo de Trabalho

1. **Fork** o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um **Pull Request**

### Convenções de Commit

Seguimos o padrão Conventional Commits:

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Estilização
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas diversas

### Padrões de Código

- TypeScript estrito
- Vue 3 com `<script setup lang="ts">`
- Componentes funcionais com Composition API
- Composables para lógica compartilhada
- Auto-importação de componentes Nuxt
- Clean Architecture na camada server

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🙏 Agradecimentos

- [Nuxt](https://nuxt.com)
- [Vue.js](https://vuejs.org)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)

---

<p align="center">
  Made with ❤️ by <a href="https://ruanvalente-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer"><b>Ruan Valente | Conta.AI Team</b></a> 👋🏽
</p>
