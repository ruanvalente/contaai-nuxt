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
- [x] `icons.vue` → `UIcon` (i-lucide-*)
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
  --color-sidebar: #34271C;
  --color-accent: #C8A97D;
  --color-book-bg: #FAF6F1;
  --color-text-dark: #1F2937;
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

# Fase 4 — Estatísticas

## Objetivo

Exibir informações em tempo real sobre o documento.

---

### Etapa 4.1 — Contador de palavras

Criar

`word-counter.vue`

Com

`use-word-counter.ts`

---

### Etapa 4.2 — Contador de caracteres

Criar

`character-counter.vue`

Com

`use-character-counter.ts`

---

### Etapa 4.3 — Tempo de leitura

Criar

`reading-time.vue`

Com

`use-reading-time.ts`

Base:

- 200 palavras/minuto.

---

### Etapa 4.4 — Atualização automática

Sempre que o editor sofrer alteração:

- recalcular métricas;
- atualizar barra inferior.

---

# Fase 5 — Navegação por capítulos

## Objetivo

Permitir organizar livros extensos.

---

### Etapa 5.1 — Criar

`chapter-list.vue`

Exibir:

- lista de capítulos;
- capítulo ativo.

---

### Etapa 5.2 — CRUD

Permitir:

- criar;
- editar;
- excluir;
- duplicar;
- mover.

---

### Etapa 5.3 — Drag and Drop

Ordenação visual.

Persistir automaticamente.

---

### Etapa 5.4 — Navegação

Ao selecionar um capítulo:

- carregar conteúdo;
- atualizar editor.

---

# Fase 6 — Histórico de versões

## Objetivo

Permitir restaurar versões anteriores.

---

### Etapa 6.1 — Criar

`use-version-history.ts`

---

### Etapa 6.2 — Criar

`version-history.vue`

Mostrar:

- data;
- hora;
- versão;
- usuário.

---

### Etapa 6.3 — Comparação

Selecionar duas versões.

Visualizar diferenças.

---

### Etapa 6.4 — Restaurar

Permitir restaurar qualquer versão.

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

| Sprint       | Entregas                                                                                | Status       |
| ------------ | --------------------------------------------------------------------------------------- | ------------ |
| **Sprint 1** | Instalação, configuração do Nuxt UI Editor, estrutura de pastas, tipagens e editor base | ✅ Concluído |
| **Sprint 2** | Toolbar, barra de status e integração completa com o editor                             | ✅ Concluído |
| **Sprint 3** | Autosave, persistência e indicador de salvamento                                        | ✅ Concluído |
| **Sprint 3.5** | Migração completa para Nuxt UI (todos componentes, páginas, layouts)                   | ✅ Concluído |
| **Sprint 4** | Contador de palavras, caracteres e tempo estimado de leitura                            | ⏳ Próximo   |
| **Sprint 5** | Navegação e gerenciamento de capítulos                                                  | ⬜ Pendente  |
| **Sprint 6** | Histórico de versões e restauração                                                      | ⬜ Pendente  |
| **Sprint 7** | Modo foco e tela cheia                                                                  | ⬜ Pendente  |
| **Sprint 8** | Exportação para Markdown e PDF, refinamentos finais e testes de integração              | ⬜ Pendente  |

Esse plano estabelece uma progressão clara: primeiro a infraestrutura, depois a experiência de escrita, seguida pelos recursos de produtividade e, por fim, as funcionalidades avançadas de gerenciamento e exportação. Isso reduz o risco de retrabalho e facilita validar cada etapa antes de avançar para a próxima.
