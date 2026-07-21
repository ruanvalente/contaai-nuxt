# Plano de Implementação - Editor de Livros com Nuxt UI Editor

## Objetivo

Desenvolver um editor de livros moderno utilizando o **Nuxt UI Editor**, seguindo as boas práticas do Nuxt 3, Vue 3 e TypeScript, com arquitetura modular, escalável e preparada para futuras funcionalidades como colaboração em tempo real, IA, exportação para ePub e sincronização na nuvem.

---

# Fase 1 — Instalação e Configuração ✅ CONCLUÍDA

## Objetivo

Preparar toda a infraestrutura necessária para utilização do Nuxt UI Editor. https://ui.nuxt.com/docs/components/editor

### Status: ✅ Concluída em 2026-07-17

#### Etapa 1.1 — Instalação

- [x] `@nuxt/ui` v4.10.0 instalado (inclui Tiptap internamente)
- [x] Corrigido erro de sintaxe no `nuxt.config.ts` (`'@nuxt/ui` → `"@nuxt/ui"`)
- [x] Adicionado `compatibilityVersion: 4` e `typedPages: true`

#### Etapa 1.2 — Configuração

- [x] Configurado `ui.theme` com `colorMode: true`
- [x] Definidas cores `primary: indigo` e `neutral: slate`
- [x] Adicionada rota `/discover/books/*/editor` no `exclude` do Supabase
- [x] Configuração de responsividade herdada do Tailwind CSS

#### Etapa 1.3 — Estrutura do módulo

- [x] `app/components/editor/` — 4 componentes criados
- [x] `app/composables/` — 9 composables criados
- [x] `app/stores/editor-store.ts` — Store Pinia criado
- [x] `app/types/editor.ts` — Tipagens completas criadas
- [x] `app/utils/editor/` — 3 utilitários criados
- [x] `app/pages/discover/books/[id]/editor.vue` — Página criada

#### Etapa 1.4 — Tipagens

- [x] `BookDocument`, `Chapter`, `EditorContent` — Estrutura de documento
- [x] `EditorNode`, `InlineNode`, `Mark` — Tipos ProseMirror
- [x] `Version`, `VersionDiff`, `DiffSegment` — Histórico de versões
- [x] `EditorStats`, `CursorPosition` — Estatísticas
- [x] `SaveStatus`, `SaveResult` — Status de salvamento
- [x] `EditorState`, `EditorConfig` — Estado do editor
- [x] `ExportFormat`, `ExportOptions`, `ExportResult` — Exportação
- [x] `FocusModeState`, `FullscreenState` — Modos especiais
- [x] Valores padrão: `DEFAULT_EDITOR_CONFIG`, `DEFAULT_STATS`, `EMPTY_EDITOR_CONTENT`

#### Arquivos criados:

```text
app/
├── components/
│   └── editor/
│       ├── book-editor.vue        ✅
│       ├── editor-toolbar.vue     ✅
│       ├── editor-status-bar.vue  ✅
│       └── save-status.vue        ✅
├── composables/
│   ├── use-editor.ts              ✅
│   ├── use-autosave.ts            ✅
│   ├── use-word-counter.ts        ✅
│   ├── use-character-counter.ts   ✅
│   ├── use-reading-time.ts        ✅
│   ├── use-fullscreen.ts          ✅
│   ├── use-focus-mode.ts          ✅
│   ├── use-version-history.ts     ✅
│   └── use-export.ts             ✅
├── stores/
│   └── editor-store.ts            ✅
├── types/
│   └── editor.ts                  ✅
├── utils/
│   └── editor/
│       ├── editor-utils.ts        ✅
│       ├── markdown-utils.ts      ✅
│       └── pdf-utils.ts           ✅
└── pages/
    └── discover/
        └── books/
            └── [id]/
                └── editor.vue     ✅
```

### Etapa 1.1 — Instalação

- Instalar o **Nuxt UI** (caso ainda não esteja instalado).
- Instalar todas as dependências necessárias para o funcionamento do Editor.
- Registrar corretamente os módulos no `nuxt.config.ts`.
- Verificar compatibilidade com Nuxt 3 e TypeScript.

---

### Etapa 1.2 — Configuração

Realizar as configurações iniciais:

- Configurar tema do editor.
- Configurar Dark Mode.
- Definir idioma padrão.
- Configurar estilos globais.
- Garantir responsividade.

---

### Etapa 1.3 — Estrutura do módulo

Criar a estrutura inicial do editor.

```text
app/
│
├── components/
│   └── editor/
│       ├── book-editor.vue
│       ├── editor-toolbar.vue
│       ├── editor-status-bar.vue
│       ├── word-counter.vue
│       ├── character-counter.vue
│       ├── reading-time.vue
│       ├── save-status.vue
│       ├── chapter-list.vue
│       ├── version-history.vue
│       ├── export-dialog.vue
│       └── focus-toggle.vue
│
├── composables/
│   ├── use-editor.ts
│   ├── use-autosave.ts
│   ├── use-word-counter.ts
│   ├── use-character-counter.ts
│   ├── use-reading-time.ts
│   ├── use-fullscreen.ts
│   ├── use-focus-mode.ts
│   ├── use-version-history.ts
│   └── use-export.ts
│
├── stores/
│   └── editor-store.ts
│
├── types/
│   └── editor.ts
│
├── utils/
│   ├── editor-utils.ts
│   ├── markdown-utils.ts
│   └── pdf-utils.ts
│
└── pages/
    └── discover/
        └── books/
            └── [id]/
                └── editor.vue
```

---

### Etapa 1.4 — Tipagens

Criar todas as interfaces iniciais.

Exemplo:

- Documento
- Capítulo
- Versão
- Estatísticas
- Estado do Editor

---

# Fase 2 — Editor Base ✅ CONCLUÍDA

## Objetivo

Disponibilizar um editor totalmente funcional.

### Status: ✅ Concluída em 2026-07-17

#### Etapa 2.1 — Criar `book-editor.vue` ✅

- [x] Inicializado `UEditor` do Nuxt UI com `content-type="json"`
- [x] Recebimento de conteúdo via `v-model` (EditorContent)
- [x] Emissão de alterações via `@update:model-value`
- [x] Trabalho com JSON ProseMirror nativamente
- [x] Integrado `UEditorToolbar` (fixed + bubble) dentro do slot
- [x] Integrado `UEditorSuggestionMenu` (comandos `/`)
- [x] Integrado `UEditorDragHandle` para reordenação de blocos
- [x] Suporte a `placeholder` e `readOnly` via props
- [x] Sincronização bidirecional com Pinia store
- [x] Cálculo automático de estatísticas ao criar/atualizar
- [x] Extração de posição do cursor via `@selection-update`

#### Etapa 2.2 — Criar `use-editor.ts` ✅

- [x] Refatorado composable para integração limpa com UEditor
- [x] `loadContent()` — carrega conteúdo e recalcula stats
- [x] `getContent()` — retorna conteúdo atual
- [x] `clearContent()` — reseta para documento vazio
- [x] `recalculateStats()` — recalcula métricas do documento
- [x] `updateStats()` — atualiza stats manualmente
- [x] `resetState()` — reseta todo o store
- [x] `setLoading()` / `setError()` — controle de estado
- [x] Computed properties: `content`, `stats`, `saveStatus`, `isActive`, `isLoading`, `error`, `isDirty`, `cursorPosition`

#### Etapa 2.3 — Toolbar ✅

- [x] Reescrito `editor-toolbar.vue` como wrapper do `UEditorToolbar`
- [x] Botões de formatação via handlers nativos (`kind: 'mark'`)
  - Negrito (`bold`), Itálico (`italic`), Sublinhado (`underline`), Tachado (`strike`), Código (`code`)
- [x] Botões de bloco via handlers nativos
  - Cabeçalhos (H1-H4), Listas (bullet/ordered), Citação, Código
- [x] Botões de ação: Link, Desfazer, Refazer
- [x] Bubble toolbar para formatação rápida na seleção
- [x] Botões de Modo Foco e Tela Cheia mantidos na toolbar
- [x] Todos os botões utilizam API oficial do Nuxt UI Editor

#### Etapa 2.4 — Barra inferior ✅

- [x] Contador de palavras (`useWordCounter`)
- [x] Contador de caracteres (`useCharacterCounter`)
- [x] Tempo de leitura estimado (`useReadingTime`)
- [x] Posição do cursor (Linha, Coluna) via `cursorPosition` do store
- [x] Indicador de status de salvamento (`save-status.vue`)

#### Correções adicionais:

- [x] Removido `@nuxtjs/tailwindcss` do `nuxt.config.ts` (conflito com `@nuxt/ui` v4)
- [x] Adicionado `vite.optimizeDeps.include` para pacotes prosemirror (evita erro de plugins duplicados)
- [x] Atualizado `editor.vue` para usar `EditorBookEditor` com v-model

#### Arquivos modificados:

```text
app/
├── components/
│   └── editor/
│       ├── book-editor.vue        ✅ Reescrito (UEditor + toolbar + suggestion menu)
│       ├── editor-toolbar.vue     ✅ Reescrito (wrapper UEditorToolbar)
│       ├── editor-status-bar.vue  ✅ Atualizado (cursor position adicionado)
│       └── save-status.vue        ✅ (sem alterações)
├── composables/
│   ├── use-editor.ts              ✅ Refatorado (integração UEditor)
│   ├── use-autosave.ts            ✅ (sem alterações)
│   ├── use-word-counter.ts        ✅ (sem alterações)
│   ├── use-character-counter.ts   ✅ (sem alterações)
│   ├── use-reading-time.ts        ✅ (sem alterações)
│   ├── use-fullscreen.ts          ✅ (sem alterações)
│   ├── use-focus-mode.ts          ✅ (sem alterações)
│   ├── use-version-history.ts     ✅ (sem alterações)
│   └── use-export.ts             ✅ (sem alterações)
├── stores/
│   └── editor-store.ts            ✅ (sem alterações)
├── types/
│   └── editor.ts                  ✅ (sem alterações)
├── utils/
│   └── editor/
│       ├── editor-utils.ts        ✅ (sem alterações)
│       ├── markdown-utils.ts      ✅ (sem alterações)
│       └── pdf-utils.ts           ✅ (sem alterações)
└── pages/
    └── discover/
        └── books/
            └── [id]/
                └── editor.vue     ✅ Atualizado (usa EditorBookEditor)

nuxt.config.ts                     ✅ Atualizado (vite.optimizeDeps + removido @nuxtjs/tailwindcss)
```

---

# Fase 3 — Autosave ✅ CONCLUÍDA

## Objetivo

Garantir que nenhum conteúdo seja perdido.

### Status: ✅ Concluída em 2026-07-17

#### Etapa 3.1 — Criar `use-autosave.ts` ✅

- [x] Composable implementado com debounce de 3 segundos
- [x] Detecção automática de alterações via watcher no `isDirty`
- [x] Suporte a save handler configurável via `setSaveHandler()`
- [x] Métodos para habilitar/desabilitar auto-save
- [x] Limpeza adequada com `onUnmounted`
- [x] Salvamento manual via `saveNow()`

#### Etapa 3.2 — Indicador de salvamento ✅

- [x] `save-status.vue` implementado com três estados
- [x] Estados visuais: Salvando (spinner), Salvo (check), Erro (alerta)
- [x] Texto relativo: "Agora", "1 min atrás", etc.
- [x] Ícones Lucide para cada estado
- [x] Integração com `editor-status-bar.vue`

#### Etapa 3.3 — Persistência ✅

- [x] API `server/api/editor/chapter/[id].put.ts` para salvar capítulo
- [x] API `server/api/editor/chapter/[id].get.ts` para carregar capítulo
- [x] API `server/api/editor/chapters/index.get.ts` para listar capítulos
- [x] Integração com Supabase para persistência no banco de dados
- [x] Verificação de propriedade (ownership) em todas as APIs
- [x] Formato JSONB para conteúdo ProseMirror

#### Etapa 3.4 — Recuperação ✅

- [x] Carregamento automático ao abrir o editor
- [x] Recuperação do último conteúdo salvo
- [x] Suporte a shortcut `Ctrl+S` / `Cmd+S` para salvamento manual
- [x] Tratamento de erros com mensagens amigáveis

#### Migration criada:

```sql
-- 044_create_chapters.sql
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES user_books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Novo Capítulo',
  content JSONB, -- ProseMirror JSON
  "order" INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Arquivos criados/modificados:

```text
server/
├── api/
│   └── editor/
│       ├── chapter/
│       │   ├── [id].get.ts     ✅ Criado (carregar capítulo)
│       │   └── [id].put.ts     ✅ Criado (salvar capítulo)
│       └── chapters/
│           └── index.get.ts    ✅ Criado (listar capítulos)

supabase/
└── migrations/
    └── 044_create_chapters.sql ✅ Criado (tabela chapters)

app/
├── pages/
│   └── discover/
│       └── books/
│           └── [id]/
│               └── editor.vue  ✅ Atualizado (integração API)
```

---

# Fase 3.5 — Migração para Nuxt UI (Todos os Componentes) ✅ CONCLUÍDA

## Objetivo

Substituir classes Tailwind CSS manuais por componentes Nuxt UI em toda a aplicação, eliminando dependência de styling manual e corrigindo o bug de carregamento do TailwindCSS v4.

### Status: ✅ Concluída em 2026-07-17

#### Etapa 3.5.1 — Setup do TailwindCSS v4 ✅

- [x] Removido `@nuxtjs/tailwindcss` (incompatível com TailwindCSS v4)
- [x] Criado `app/assets/css/main.css` com `@import "tailwindcss"` + bloco `@theme`
- [x] Deletado `tailwind.config.ts` (configuração movida para CSS-first)
- [x] Mapeadas todas as cores customizadas (`sidebar`, `accent`, `book-bg`, `text-dark`, primary/accent variants)
- [x] Mapeadas fontes customizadas (Inter, Playfair Display, Cormorant Garamond)

#### Etapa 3.5.2 — Componentes Shared UI ✅

- [x] `button.vue` → `UButton`
- [x] `input.vue` → `UInput` + `UFormField`
- [x] `card.vue` → `UCard`
- [x] `badge.vue` → `UBadge`
- [x] `toast.vue` → `UAlert`
- [x] `skeleton-text.vue` → `USkeleton`
- [x] `container.vue` → `UContainer`
- [x] `icons.vue` → `UIcon` (i-lucide-\*)
- [x] `metrics-card.vue` → `UCard`
- [x] `favorite-button.vue` → `UButton`
- [x] `hamburger-button.vue` → `UButton`
- [x] `search-input.vue` → `UInput`

#### Etapa 3.5.3 — Layout Components ✅

- [x] `app-sidebar.vue` → `UIcon`
- [x] `sidebar-item.vue` → `UButton`
- [x] `app-header.vue` → `UButton` + `UAvatar`
- [x] `app-container.vue` → removidas cores hardcoded
- [x] `dashboard.vue` layout → `UContainer`

#### Etapa 3.5.4 — Dashboard Components ✅

- [x] `sidebar.vue` → `UButton` com `UIcon`
- [x] `header.vue` → `UButton` + `UAvatar` + `UIcon`
- [x] `book-card.vue` → `UCard` + `UBadge` + `UButton`
- [x] `quick-actions.vue` → `UButton` com `UIcon`
- [x] `empty-books.vue` → `UButton` + `UIcon`
- [x] `category-select.vue` → `USelectMenu`
- [x] `upload-cover.vue` → `UButton`
- [x] `cover-color-picker.vue` → `UButton`
- [x] `create-book-modal.vue` → `UModal` + `UInput` + `UButton`

#### Etapa 3.5.5 — Auth Pages ✅

- [x] `login.vue` → `UAlert` + `UFormField` + `UInput` + `UButton` (loading prop)
- [x] `register.vue` → `UAlert` + `UFormField` + `UInput` + `UButton` (loading prop)
- [x] `forgot-password.vue` → `UAlert` + `UFormField` + `UInput` + `UButton` (loading prop)
- [x] `reset-password.vue` → `UAlert` + `UFormField` + `UInput` + `UButton` (loading prop)
- [x] `check-email.vue` → `UIcon` (i-lucide-mail)

#### Etapa 3.5.6 — Discover Pages ✅

- [x] `explore.vue` → `UInput` + `UBadge` + `USkeleton` + `UButton` + `UIcon`
- [x] `my-session.vue` → `USkeleton` + `UButton`
- [x] `library.vue` → token colors (text-highlight, text-muted)
- [x] `favorites.vue` → token colors
- [x] `categories.vue` → token colors
- [x] `downloads.vue` → token colors
- [x] `settings.vue` → token colors
- [x] `index.vue` → `UButton` + `UModal` + `UIcon`

#### Etapa 3.5.7 — Book Components ✅

- [x] `discovery-cover.vue` → sem alterações (usa variante CSS inline)
- [x] `discovery-card.vue` → `focus:ring-primary`
- [x] `discovery-rating.vue` → sem alterações
- [x] `book-details/panel.vue` → `USkeleton` + `UIcon` + `UBadge` + `UButton`
- [x] `book-details/modal.vue` → `UButton` + token colors (bg-surface, border-default)

#### Etapa 3.5.8 — Landing Components ✅

- [x] `header.vue` → `UButton` com UIcon (menu/x toggle)
- [x] `hero.vue` → `UButton` com icon (play)
- [x] `books-showcase.vue` → `UBadge` + `UButton`

#### Tokens de Cores Utilizados:

```css
@theme {
  --color-sidebar: #34271c;
  --color-accent: #c8a97d;
  --color-book-bg: #faf6f1;
  --color-text-dark: #1f2937;
  /* + primary/accent variants */
}
```

Classes utilitárias: `text-highlight`, `text-muted`, `bg-surface`, `border-default`, `text-primary`, `text-error`, `text-success`, `text-warning`

#### Arquivos modificados:

```text
app/
├── assets/css/main.css                    ✅ Criado (TailwindCSS v4 @theme)
├── nuxt.config.ts                         ✅ Atualizado (css path)
├── components/
│   ├── shared/ui/ (12 arquivos)           ✅ Reescritos
│   ├── layout/ (5 arquivos)               ✅ Reescritos
│   ├── dashboard/ (8 arquivos)            ✅ Reescritos
│   ├── editor/ (4 arquivos)               ✅ Já Nuxt UI
│   ├── book/ (3 arquivos)                 ✅ Atualizados
│   ├── book-details/ (2 arquivos)         ✅ Reescritos
│   └── landing/ (3 arquivos)              ✅ Reescritos
├── pages/auth/ (5 páginas)                ✅ Reescritas
├── pages/discover/ (8 páginas)            ✅ Reescritas
└── layouts/ (3 layouts)                   ✅ Reescritos

package.json                               ✅ Atualizado (sem @nuxtjs/tailwindcss)
tailwind.config.ts                         ❌ Deletado
```

---

# Fase 3.6 — Correções e Otimizações do Code Review ✅ CONCLUÍDA

## Objetivo

Corrigir bugs críticos, adicionar tratamento de erros e otimizar performance identificados durante revisão de código.

### Status: ✅ Concluída em 2026-07-21

#### Etapa 3.6.1 — Bug de corrupção de dados ao renomear capítulo ✅

- [x] **Bug crítico**: `saveEdit` em `chapter-list.vue` enviava `store.content` (conteúdo do capítulo ativo) ao renomear um capítulo diferente, podendo sobrescrever o conteúdo de outro capítulo no servidor
- [x] **Client**: `saveEdit` agora envia apenas `{ title }` em vez de `{ content, title, wordCount }`
- [x] **Server**: Endpoint `PUT /chapter/[id]` agora aceita `content` como opcional — apenas campos presentes no request são atualizados
- [x] Variável `updated` não utilizada (dead code) removida do `[id].put.ts`

#### Etapa 3.6.2 — Tratamento de erros com rollback ✅

- [x] `deleteChapter`: salva estado anterior (`previousChapters`, `previousActive`) antes de update otimista; reverte em caso de falha na API
- [x] `onDrop`: salva `previousChapters` antes de reordenar; reverte em caso de falha no `$fetch`
- [x] UI permanece consistente com o servidor mesmo quando requests falham

#### Etapa 3.6.3 — Verificação de ownership para documentos vazios ✅

- [x] **Bug**: `GET /chapters` e `PUT /reorder` retornavam 403 para documentos sem capítulos (verificação via tabela `chapters` retornava vazio)
- [x] Adicionado fallback para tabela `user_books` quando `chapters` está vazio
- [x] Mesma correção aplicada em `reorder.put.ts`
- [x] Padronizado com pattern já existente em `chapter/index.post.ts`

#### Etapa 3.6.4 — Otimização de performance no reorder ✅

- [x] Updates sequenciais (`for` loop com `await`) substituídos por `Promise.all` para execução concorrente
- [x] Redução de latência para documentos com muitos capítulos

#### Arquivos modificados:

```text
app/components/editor/chapter-list.vue      ✅ saveEdit (só title), rollback em delete/reorder
server/api/editor/chapter/[id].put.ts       ✅ content opcional, dead code removido
server/api/editor/chapters/index.get.ts     ✅ fallback user_books para docs vazios
server/api/editor/chapters/reorder.put.ts   ✅ Promise.all + fallback user_books
```

---

### Fluxo de Salvamento Implementado:

```
Editor (digitação)
    ↓
useAutosave (detecta mudança no isDirty)
    ↓
Debounce (3 segundos)
    ↓
setSaveHandler (chamado)
    ↓
$fetch PUT /api/editor/chapter/[id]
    ↓
Supabase (atualiza chapters.content)
    ↓
Resposta OK → store.markSaved()
    ↓
save-status.vue (exibe "Salvo ✓")
```

---

# Fase 4 — Estatísticas ✅ CONCLUÍDA

## Objetivo

Exibir informações em tempo real sobre o documento.

### Status: ✅ Concluída em 2026-07-21

#### Etapa 4.1 — Contador de palavras ✅

- [x] `use-word-counter.ts` implementado com `wordCount`, `formattedWordCount`, `countWords`, `calculateWordCount`
- [x] Formatação em português ("1 palavra" / "X palavras")
- [x] Integração via `editor-store.ts` (`stats.words`)

#### Etapa 4.2 — Contador de caracteres ✅

- [x] `use-character-counter.ts` implementado com `characterCount`, `characterCountNoSpaces`, `formattedCharacterCount`
- [x] Método `countCharacters(text, includeSpaces)` flexível
- [x] Cálculo automático via `calculateStats()` no `editor-utils.ts`

#### Etapa 4.3 — Tempo de leitura ✅

- [x] `use-reading-time.ts` implementado com `readingTimeMinutes`, `speakingTimeMinutes`
- [x] Base: 200 palavras/minuto (leitura), 150 palavras/minuto (fala)
- [x] Formatação: "Menos de 1 min", "X min de leitura", "X min de fala"

#### Etapa 4.4 — Atualização automática ✅

- [x] `book-editor.vue` chama `calculateStats()` no `@update:model-value` e `@create`
- [x] `store.setStats()` atualiza o Pinia store em tempo real
- [x] `editor-status-bar.vue` reage via computed properties ao store

#### Melhorias adicionais na barra de status:

- [x] Adicionado contador de páginas estimadas (250 palavras/página)
- [x] Adicionado contador de frases
- [x] Adicionado contador de parágrafos
- [x] Adicionado tempo de fala estimado
- [x] Adicionado caracteres sem espaços
- [x] Separadores visuais (`|`) entre grupos de métricas
- [x] Tooltips em todos os indicadores
- [x] Layout responsivo: métricas extras ocultas em telas menores (`hidden sm:flex`, `hidden md:flex`, `hidden lg:flex`)
- [x] Adicionados getters ao `editor-store.ts`: `pageCount`, `sentenceCount`, `paragraphCount`, `speakingTime`

#### Arquivos modificados:

```text
app/
├── components/
│   └── editor/
│       └── editor-status-bar.vue  ✅ Reescrito (8 métricas + responsivo)
├── composables/
│   ├── use-word-counter.ts        ✅ (sem alterações)
│   ├── use-character-counter.ts   ✅ (sem alterações)
│   └── use-reading-time.ts        ✅ (sem alterações)
├── stores/
│   └── editor-store.ts            ✅ Atualizado (4 novos getters)
└── utils/
    └── editor/
        └── editor-utils.ts        ✅ (sem alterações — calculateStats já computava tudo)
```

---

# Fase 5 — Navegação por capítulos ✅ CONCLUÍDA

## Objetivo

Permitir organizar livros extensos.

### Status: ✅ Concluída em 2026-07-21

#### Etapa 5.1 — Criar `chapter-list.vue` ✅

- [x] Componente sidebar exibindo lista de capítulos com capítulo ativo destacado
- [x] Indicador visual de capítulo selecionado (`bg-primary/10 border-l-2 border-primary`)
- [x] Contador de palavras por capítulo na lista
- [x] Header com título "Capítulos" e botão de criar novo capítulo
- [x] Estado vazio amigável ("Nenhum capítulo ainda")
- [x] Suporte a mobile via `USelect` dropdown no `editor.vue` (sidebar oculta em telas < md)

#### Etapa 5.2 — CRUD ✅

- [x] **Criar**: POST para `/api/editor/chapter` com `documentId`, novo capítulo inserido e ordenado
- [x] **Editar (renomear)**: Inline edit com `UInput`, Enter para salvar, Escape para cancelar
- [x] **Excluir**: Exclusão otimista com rollback; botão desabilitado quando há apenas 1 capítulo
- [x] **Duplicar**: Cria nova cópia com título "(cópia)" e conteúdo original, order +1
- [x] Reordenação automática após exclusão (atualiza `order` de todos os capítulos restantes)

#### Etapa 5.3 — Drag and Drop ✅

- [x] HTML5 nativo (`draggable`, `dragstart`, `dragover`, `dragend`/`onDrop`)
- [x] Indicadores visuais: opacidade no item arrastado, borda no local de destino
- [x] Atualização otimista da ordem no store
- [x] Persistência via `PUT /api/editor/chapters/reorder` com `Promise.all` (paralelo)
- [x] Rollback em caso de falha na API
- [x] Ícone `grip-vertical` como alça de arrasto

#### Etapa 5.4 — Navegação ✅

- [x] Ao clicar em capítulo, conteúdo é carregado via `loadChapterContent()` (fetch individual)
- [x] **Bug corrigido**: API `GET /chapters` não retornava `content`; agora ao selecionar um capítulo vazio, o conteúdo é buscado via `GET /chapter/:id`
- [x] `editor.vue` busca conteúdo do primeiro capítulo ao abrir o editor
- [x] Atualização automática do Pinia store com conteúdo carregado
- [x] Cache local: se capítulo já tem conteúdo carregado, usa direto sem nova requisição

#### Bug corrigido — Carregamento de conteúdo ao trocar de capítulo:

- [x] **Problema**: `GET /api/editor/chapters` não retornava campo `content` (apenas metadata), então todos os capítulos iniciavam com conteúdo vazio
- [x] **Solução**: Adicionado `loadChapterContent()` no `editor-store.ts` que busca conteúdo via `GET /chapter/:id`
- [x] `chapter-list.vue` verifica se capítulo está vazio antes de selecionar; se vazio, busca conteúdo da API
- [x] `editor.vue` usa `loadChapterContent()` no carregamento inicial em vez de `setActiveChapter()` direto
- [x] Conteúdo carregado é cacheado no array `chapters` do store para evitar requisições repetidas

#### Arquivos modificados:

```text
app/
├── components/
│   └── editor/
│       └── chapter-list.vue      ✅ selectChapter() agora busca conteúdo se vazio
├── stores/
│   └── editor-store.ts           ✅ Adicionado loadChapterContent() assíncrono
└── pages/
    └── discover/
        └── books/
            └── [id]/
                └── editor.vue    ✅ loadBook() usa loadChapterContent() no primeiro capítulo
```

#### Correções do Code Review ✅

- [x] **Erro silencioso em `loadChapterContent`**: agora define `this.error` e `this.isLoading` no store em caso de falha
- [x] **Race condition na troca de capítulos**: adicionado guard `isLoadingChapter` que impede cliques simultâneos; ignorado clique no capítulo já ativo
- [x] **Mobile setter bypassava `loadChapterContent`**: `selectedChapterId` setter em `editor.vue` agora verifica conteúdo vazio e usa `loadChapterContent()` em vez de `setActiveChapter()` direto
- [x] **Stats não recalculadas ao trocar de capítulo**: `loadChapterContent()` agora importa `calculateStats` e atualiza `this.stats` com as métricas do novo capítulo
- [x] **Indicador visual de carregamento**: spinner animado exibido ao lado do título do capítulo sendo carregado

#### Arquivos modificados (code review):

```text
app/
├── components/
│   └── editor/
│       └── chapter-list.vue      ✅ Guard isLoadingChapter + indicador visual de loading
├── stores/
│   └── editor-store.ts           ✅ Error state, isLoading, stats recalculados
└── pages/
    └── discover/
        └── books/
            └── [id]/
                └── editor.vue    ✅ selectedChapterId setter usa loadChapterContent
```

---

# Fase 6 — Histórico de versões ✅ CONCLUÍDA

## Objetivo

Permitir restaurar versões anteriores.

### Status: ✅ Concluída em 2026-07-21

#### Etapa 6.1 — Criar `use-version-history.ts` ✅

- [x] Reescrito com chamadas API reais (GET/POST/restore)
- [x] `loadVersions(chapterId)` — carrega versões do servidor
- [x] `saveVersion(chapterId, label?)` — salva snapshot do conteúdo atual
- [x] `restoreVersion(versionId)` — restaura conteúdo e recalcula stats
- [x] `selectVersion(versionId)` — seleção para comparação (toggle A/B)
- [x] `compareVersions()` — retorna diff com `computeDiff()`
- [x] `clearSelection()` — limpa seleção
- [x] Computed: `sortedVersions`, `canCompare`, `canRestore`, `selectedVersionA`, `selectedVersionB`
- [x] Helpers: `formatDate()`, `formatRelativeTime()`, `getTextPreview()`

#### Etapa 6.2 — Criar `version-history.vue` ✅

- [x] Sidebar com lista de versões ordenadas por data (mais recente primeiro)
- [x] Header com título "Histórico" e botão fechar
- [x] Botão "Salvar versão" com input de rótulo opcional
- [x] Cada versão exibe: rótulo/data, autor, word count, preview do conteúdo
- [x] Seleção visual de versão A/B com badges
- [x] Ações: Comparar (diff), Restaurar, Limpar seleção
- [x] Confirmação antes de restaurar ("O conteúdo atual será substituído")
- [x] Estado vazio amigável ("Nenhuma versão salva ainda")
- [x] Loading spinner ao carregar
- [x] Exibição de erros via UAlert

#### Etapa 6.3 — Comparação ✅

- [x] `diff-utils.ts` — Algoritmo de diff baseado em LCS (Longest Common Subsequence)
- [x] Extração de palavras do ProseMirror JSON com contexto de bloco
- [x] Classificação em added/removed/unchanged
- [x] Visualização inline: texto removido (vermelho + line-through), adicionado (verde + bold), inalterado (muted)
- [x] Preview de comparação mostrando versões A → B

#### Etapa 6.4 — Restaurar ✅

- [x] API `POST /api/editor/version/[id]/restore` — atualiza conteúdo do capítulo
- [x] Cálculo automático de word_count ao restaurar
- [x] Atualização do Pinia store com conteúdo restaurado
- [x] Recálculo de estatísticas após restauração

#### Migration criada:

```sql
-- 045_create_chapter_versions.sql
CREATE TABLE chapter_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  document_id UUID REFERENCES user_books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  label TEXT,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### APIs criadas:

```text
server/api/editor/
├── chapter/
│   └── [id]/
│       └── versions/
│           ├── index.get.ts    ✅ (listar versões do capítulo)
│           └── index.post.ts   ✅ (criar nova versão)
└── version/
    └── [id]/
        └── restore.post.ts     ✅ (restaurar versão)
```

#### Arquivos criados/modificados:

```text
app/
├── components/
│   └── editor/
│       └── version-history.vue  ✅ Criado (sidebar de histórico)
├── composables/
│   └── use-version-history.ts   ✅ Reescrito (API reais)
├── types/
│   └── editor.ts                ✅ Atualizado (wordCount em Version)
└── utils/
    └── editor/
        └── diff-utils.ts        ✅ Criado (algoritmo LCS)
└── pages/
    └── discover/
        └── books/
            └── [id]/
                └── editor.vue   ✅ Atualizado (painel de histórico)

server/
└── api/
    └── editor/
        ├── chapter/[id]/versions/  ✅ Criado (GET + POST)
        └── version/[id]/restore.post.ts  ✅ Criado

supabase/
└── migrations/
    └── 045_create_chapter_versions.sql  ✅ Criado
```

---

### Limites implementados:

- Máximo de 50 versões por capítulo (exclui automaticamente as mais antigas)
- Versões são imutáveis (sem trigger de updated_at)
- RLS: usuários só veem/gerenciam suas próprias versões

---

# Fase 7 — Modo Foco

## Objetivo

Eliminar distrações durante a escrita.

---

### Etapa 7.1 — Criar

`focus-toggle.vue`

---

### Etapa 7.2 — Criar

`use-focus-mode.ts`

Ocultar:

- sidebar;
- header;
- painéis laterais.

---

### Etapa 7.3 — Expandir editor

Editor ocupa praticamente toda a largura da tela, preservando apenas os controles essenciais.

---

### Etapa 7.4 — Atalho

Adicionar atalho:

```
Ctrl + Shift + F
```

---

# Fase 8 — Tela Cheia

## Objetivo

Experiência imersiva.

---

### Etapa 8.1 — Criar

`use-fullscreen.ts`

Utilizar a Fullscreen API.

---

### Etapa 8.2 — Botão

Adicionar botão na Toolbar.

---

### Etapa 8.3 — Persistência

Ao entrar em tela cheia:

- manter posição;
- manter seleção;
- manter toolbar fixa.

---

# Fase 9 — Exportação

## Objetivo

Permitir exportar o conteúdo do livro.

---

### Etapa 9.1 — Markdown

Criar

`use-export.ts`

Converter:

```
JSON

↓

Markdown
```

---

### Etapa 9.2 — PDF

Criar:

`export-dialog.vue`

Fluxo:

```
JSON

↓

HTML

↓

PDF
```

Preservar:

- títulos;
- listas;
- tabelas;
- imagens;
- blocos de código;
- citações.

---

### Etapa 9.3 — Configurações

Permitir configurar:

- tamanho da página;
- margens;
- fonte;
- cabeçalho;
- rodapé;
- nome do arquivo.

---

# Arquitetura Final

```text
book-editor.vue
│
├── editor-toolbar.vue
├── editor-status-bar.vue
│
├── word-counter.vue
├── character-counter.vue
├── reading-time.vue
├── save-status.vue
│
├── chapter-list.vue
├── version-history.vue
├── export-dialog.vue
├── focus-toggle.vue
│
└── Nuxt UI Editor
```

## Ordem recomendada de desenvolvimento

| Sprint         | Entregas                                                                                         | Status       |
| -------------- | ------------------------------------------------------------------------------------------------ | ------------ |
| **Sprint 1**   | Instalação, configuração do Nuxt UI Editor, estrutura de pastas, tipagens e editor base          | ✅ Concluído |
| **Sprint 2**   | Toolbar, barra de status e integração completa com o editor                                      | ✅ Concluído |
| **Sprint 3**   | Autosave, persistência e indicador de salvamento                                                 | ✅ Concluído |
| **Sprint 3.5** | Migração completa para Nuxt UI (todos componentes, páginas, layouts)                             | ✅ Concluído |
| **Sprint 3.6** | Code review: fix corrupção dados rename, rollback erros, ownership docs vazios, reorder paralelo | ✅ Concluído |
| **Sprint 4**   | Contador de palavras, caracteres e tempo estimado de leitura                                     | ✅ Concluído |
| **Sprint 5**   | Navegação e gerenciamento de capítulos                                                           | ✅ Concluído |
| **Sprint 6**   | Histórico de versões e restauração                                                               | ✅ Concluído |
| **Sprint 7**   | Modo foco e tela cheia                                                                           | ⏳ Próximo   |
| **Sprint 8**   | Exportação para Markdown e PDF, refinamentos finais e testes de integração                       | ⬜ Pendente  |

Esse plano estabelece uma progressão clara: primeiro a infraestrutura, depois a experiência de escrita, seguida pelos recursos de produtividade e, por fim, as funcionalidades avançadas de gerenciamento e exportação. Isso reduz o risco de retrabalho e facilita validar cada etapa antes de avançar para a próxima.

As tarefas que forem envolver banco de dados sempre veja a pasta supabase/migrations, pois todas as informações referente a base de dados e tabelas necessarias para o uso estão lá.
