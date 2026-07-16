# Book Discovery Interface — Implementation Plan

> **Scope:** Build a responsive book discovery/library interface with sidebar navigation, search, category filtering, and a book card grid. Adapts to the existing Nuxt 4 (`app/` dir) architecture, Supabase backend, and Clean Architecture server layer.

---

## Execution Log

| Phase | Status | Executed At |
|-------|--------|-------------|
| Phase 0 — Foundation & Configuration | ✅ Executada | 2026-07-15 |
| Phase 1 — Layout Shell | ✅ Executada | 2026-07-15 |
| Phase 2 — Common Components | ✅ Executada | 2026-07-15 |
| Phase 3 — Book Components | ✅ Executada | 2026-07-15 |
| Phase 4 — Category Components | ✅ Executada | 2026-07-16 |
| Phase 5 — Page Assembly | ✅ Executada | 2026-07-16 |
| Phase 6 — Responsive Design | ✅ Executada | 2026-07-16 |

---

## Phase 0 — Foundation & Configuration ✅ EXECUTADA

**Goal:** Update Tailwind theme, install missing dependencies, and define shared types/constants.

### 0.1 Install Dependencies

```bash
bun add lucide-vue-next @vueuse/core pinia @pinia/nuxt
```

- `lucide-vue-next` — icon set (Search, BookOpen, Grid3X3, Download, Heart, Menu, X, Star)
- `@vueuse/core` — composables like `useMediaQuery`, `useLocalStorage`
- `pinia` + `@pinia/nuxt` — state management for future use

### 0.2 Update `nuxt.config.ts`

```ts
modules: [
  "@nuxtjs/tailwindcss",
  "@nuxtjs/google-fonts",
  "@nuxtjs/supabase",
  "@pinia/nuxt",              // add
],
```

Add `"Cormorant Garamond"` to `google-fonts` families if serif title font is preferred alongside Playfair Display.

### 0.3 Update `tailwind.config.ts`

Extend the theme with the full color palette from the prompt:

```ts
colors: {
  sidebar: '#34271C',
  'sidebar-hover': '#463427',
  primary: '#6A4A3A',
  accent: '#C8A97D',
  'book-bg': '#F7F4EF',
  'text-dark': '#2F241C',
  surface: '#FFFFFF',
  muted: '#6B7280',
  border: '#E5E7EB',
  // Keep existing primary-* and accent-* for backward compat
}
```

Add `fontFamily.serif` override to include `Cormorant Garamond` as a fallback option.

### 0.4 Define Types

**File:** `app/types/discovery.ts`

```ts
export interface DiscoveryBook {
  id: string
  title: string
  author: string
  coverColor: string
  rating: number
  reviews: number
  category: string
}

export interface DiscoveryCategory {
  id: string
  name: string
  label: string
}

export const DISCOVERY_CATEGORIES: DiscoveryCategory[] = [
  { id: 'all', name: 'All', label: 'All' },
  { id: 'sci-fi', name: 'Sci-Fi', label: 'Sci-Fi' },
  { id: 'fantasy', name: 'Fantasy', label: 'Fantasy' },
  { id: 'drama', name: 'Drama', label: 'Drama' },
  { id: 'business', name: 'Business', label: 'Business' },
  { id: 'education', name: 'Education', label: 'Education' },
  { id: 'geography', name: 'Geography', label: 'Geography' },
]
```

### 0.5 Create Composables

**File:** `app/composables/use-discovery-books.ts`

- Wraps existing `useBooks` logic or creates a parallel composable for the discovery page
- Provides `books`, `isLoading`, `selectedCategory`, `searchQuery`, `setCategory`, `setSearch`
- Uses `useRoute` / `useRouter` for URL-synced state (mirrors `explore.vue` pattern)

**File:** `app/composables/use-discovery-categories.ts`

- Returns `categories` from `DISCOVERY_CATEGORIES`
- Provides `activeCategory` reactive ref
- Handles category selection logic

**Acceptance Criteria:**
- [ ] Tailwind config has all palette colors available as utilities (`bg-sidebar`, `text-accent`, etc.)
- [ ] Types compile with `vue-tsc --noEmit`
- [ ] Composables return proper types and are auto-imported by Nuxt

---

## Phase 1 — Layout Shell ✅ EXECUTADA

**Goal:** Build the sidebar + header + main content container that fills 100vh.

> **Status:** Executada com sucesso em 2026-07-15. Todos os componentes criados:
> - `app/components/layout/SidebarItem.vue`
> - `app/components/layout/AppSidebar.vue`
> - `app/components/layout/AppHeader.vue`
> - `app/components/layout/AppContainer.vue`
> - `app/layouts/discovery.vue`

### 1.1 `AppSidebar.vue`

**Path:** `app/components/layout/AppSidebar.vue`

| Property | Value |
|----------|-------|
| Width | `w-80` (320px) |
| Background | `bg-sidebar` (#34271C) |
| Layout | `flex flex-col justify-start` |
| Padding | `p-6` (24px) |
| Gap | `gap-5` (20px) |
| Position | `fixed inset-y-0 left-0 z-30` |
| Overflow | `overflow-y-auto` |

**Structure:**

```vue
<template>
  <aside class="fixed inset-y-0 left-0 z-30 w-80 bg-sidebar flex flex-col justify-start p-6 gap-5">
    <!-- Logo -->
    <div class="flex items-center gap-3">
      <LucideBookOpen class="w-8 h-8 text-white" />
      <span class="font-semibold text-3xl text-white">ContaAI</span>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-1 mt-4">
      <SidebarItem
        v-for="item in navItems"
        :key="item.label"
        :icon="item.icon"
        :label="item.label"
        :href="item.href"
        :active="currentRoute === item.href"
      />
    </nav>
  </aside>
</template>
```

**Nav Items:**

| Label | Icon | Route |
|-------|------|-------|
| Descobrir | `Compass` | `/discover` |
| Categorias | `Grid3X3` | `/categories` |
| Minha Biblioteca | `BookOpen` | `/library` |
| Downloads | `Download` | `/downloads` |
| Favoritos | `Heart` | `/favorites` |

**Props interface:**

```ts
interface SidebarItemProps {
  icon: string        // Lucide icon name
  label: string
  href: string
  active: boolean
}
```

**Active state:** `bg-accent text-white rounded-2xl px-6 py-4`
**Inactive state:** `text-accent hover:bg-sidebar-hover transition duration-200 px-6 py-4`

### 1.2 `SidebarItem.vue`

**Path:** `app/components/layout/SidebarItem.vue`

A small presentational component. Receives `icon`, `label`, `href`, `active` props. Uses `NuxtLink` for navigation. Renders a Lucide icon + text in a `flex items-center gap-4` row.

### 1.3 `AppHeader.vue`

**Path:** `app/components/layout/AppHeader.vue`

| Property | Value |
|----------|-------|
| Height | `h-22` (88px) |
| Background | `bg-white` |
| Border | `border-b border-stone-200` |
| Padding x | `px-8` (32px) |
| Layout | `flex items-center justify-between` |
| Position | `sticky top-0 z-20` |

Contains:
- Mobile hamburger button (visible on `< xl`)
- `<SearchInput />` component (centered)
- User avatar / profile section (right)

### 1.4 `AppContainer.vue`

**Path:** `app/components/layout/AppContainer.vue`

| Property | Value |
|----------|-------|
| Background | `bg-book-bg` (#F7F4EF) |
| Padding | `p-12` (48px) |
| Gap | `gap-12` (48px) between sections |
| Layout | `flex flex-col` |
| Margin left | `ml-80` (desktop), responsive for smaller screens |
| Min height | `min-h-screen` |

Wraps the `<slot />` and applies the main content area styling.

### 1.5 Create Layout: `app/layouts/discovery.vue`

```vue
<template>
  <div class="min-h-screen">
    <LayoutAppSidebar />
    <LayoutAppHeader />
    <LayoutAppContainer>
      <slot />
    </LayoutAppContainer>
  </div>
</template>
```

**Acceptance Criteria:**
- [ ] Sidebar is fixed, 320px wide, dark brown background
- [ ] Header is sticky, 88px tall, white with bottom border
- [ ] Main content fills remaining space with correct padding
- [ ] Layout is accessible at `http://localhost:3000/discover` (using discovery layout)
- [ ] `min-h-screen` on root container

---

## Phase 2 — Common Components ✅ EXECUTADA

**Goal:** Build reusable presentational components shared across sections.

> **Status:** Executada com sucesso em 2026-07-15. Componentes criados/estendidos:
> - `app/components/shared/common/search-input.vue` — Novo componente com v-model, ícone de busca e debounce 300ms
> - `app/components/shared/common/section-title.vue` — Novo componente para títulos de seção com fonte serif
> - `app/components/shared/common/hamburger-button.vue` — Novo componente para menu mobile com aria-label
> - `app/components/shared/ui/button.vue` — Estendido com variante `ghost` (mantido padrão inline classes existente)
> - `app/components/shared/ui/rating-stars.vue` — Estendido com prop `reviews` e `showReviews`
>
> **Reorganização:** Componentes movidos de `app/components/common/` para `app/components/shared/common/` com nomes em kebab-case.
>
> **Reutilização:** Componentes `button.vue` e `rating-stars.vue` existentes foram estendidos em vez de criar novos, seguindo o princípio DRY.
>
> **Correções pós-review:**
> - Removido prop `size` do `button.vue` para evitar conflito com classes inline dos consumidores existentes
> - Cor primária mantida como `#C9A87C` para compatibilidade com páginas existentes
> - Corrigido z-index do overlay em `dashboard/sidebar.vue` de `z-40` para `z-30`

**Goal:** Build reusable presentational components shared across sections.

### 2.1 `SearchInput.vue`

**Path:** `app/components/common/SearchInput.vue`

| Property | Value |
|----------|-------|
| Width | `w-[740px]` max |
| Height | `h-[46px]` |
| Border radius | `rounded-full` |
| Border | `border border-[#DDD]` |
| Icon | `<LucideSearch />` (left, gray-400) |
| Placeholder | `Buscar livros...` |

**Props:**

```ts
interface Props {
  modelValue: string
  placeholder?: string
}
```

**Emits:** `update:modelValue`

Uses `v-model` pattern. Emits debounced search (300ms) via `useDebounceFn` from VueUse.

### 2.2 `SectionTitle.vue`

**Path:** `app/components/common/SectionTitle.vue`

**Props:**

```ts
interface Props {
  tag?: 'h1' | 'h2' | 'h3'
}
```

Default tag: `h2`.

**Styles:**
- Font: `font-serif` (Playfair Display)
- Weight: `font-bold` (700)
- Size: `text-[40px]` / `text-5xl`
- Color: `text-text-dark` (#2F241C)
- Slot-based for title text

### 2.3 `BaseButton.vue`

**Path:** `app/components/common/BaseButton.vue`

**Props:**

```ts
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}
```

| Variant | Style |
|---------|-------|
| `primary` | `bg-primary text-white rounded-full hover:opacity-90` |
| `secondary` | `bg-white text-text-dark border border-border rounded-full hover:bg-gray-50` |
| `ghost` | `bg-transparent text-muted hover:bg-gray-100 rounded-full` |

### 2.4 `HamburgerButton.vue`

**Path:** `app/components/common/HamburgerButton.vue`

Visible only on mobile/tablet (`xl:hidden`). Toggles sidebar drawer. Props: `modelValue: boolean`.

**Acceptance Criteria:**
- [x] SearchInput has v-model, rounded-full, correct dimensions
- [x] SectionTitle renders serif font at 40px
- [x] BaseButton supports 3 variants (primary, secondary, ghost)
- [x] All components use `<script setup lang="ts">`
- [x] No CSS files — Tailwind classes only

---

## Phase 3 — Book Components ✅ EXECUTADA

**Goal:** Build the book card, cover, and rating components per spec.

> **Status:** Executada com sucesso em 2026-07-15. Componentes criados:
> - `app/components/book/discovery-cover.vue` — Capa 190×290px com cor dinâmica e elementos decorativos
> - `app/components/book/discovery-rating.vue` — Wrapper delegando para `SharedUiRatingStars` (sem duplicação)
> - `app/components/book/discovery-card.vue` — Card 360px com NuxtLink, usando DiscoveryCover e DiscoveryRating
>
> **Correções pós-review:**
> - Renomeados de `book-*` para `discovery-*` para evitar colisão com `shared/ui/book-card.vue` e `shared/ui/book-cover.vue`
> - `discovery-rating.vue` delega para `SharedUiRatingStars` existente em vez de reimplementar lógica de estrelas
> - Cores hardcoded substituídas por theme tokens (`text-text-dark`, `text-muted`)

### 3.1 `BookCover.vue`

**Path:** `app/components/book/BookCover.vue`

| Property | Value |
|----------|-------|
| Width | `w-[190px]` |
| Height | `h-[290px]` |
| Border radius | `rounded-2xl` (16px) |
| Background | Dynamic `coverColor` prop (default `#6A4A3A`) |
| Layout | `flex flex-col items-center justify-center` |

**Props:**

```ts
interface Props {
  title: string
  coverColor?: string
}
```

**Structure inside cover:**

```vue
<template>
  <div
    class="w-[190px] h-[290px] rounded-2xl flex flex-col items-center justify-center p-4 relative"
    :style="{ backgroundColor: coverColor || '#6A4A3A' }"
  >
    <span class="text-[#EFE6E2] font-serif text-center text-lg leading-tight">
      {{ title }}
    </span>

    <!-- Bottom decorative line -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-px bg-[#EFE6E2]/40" />
    <!-- Small center dash -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-px bg-[#EFE6E2]/60" />
  </div>
</template>
```

### 3.2 `BookRating.vue`

**Path:** `app/components/book/BookRating.vue`

**Props:**

```ts
interface Props {
  rating: number
  reviews: number
}
```

**Template:**

```vue
<template>
  <div class="flex items-center gap-1.5">
    <span v-for="i in 5" :key="i" class="text-amber-500 text-sm">
      {{ i <= Math.round(rating) ? '★' : '☆' }}
    </span>
    <span class="text-muted text-sm">({{ reviews }})</span>
  </div>
</template>
```

### 3.3 `BookCard.vue`

**Path:** `app/components/book/BookCard.vue`

| Property | Value |
|----------|-------|
| Width | `w-[360px]` |
| Height | Auto (content-driven, ~430px) |
| Background | `bg-white` |
| Border radius | `rounded-3xl` (24px) |
| Shadow | `shadow-md` |
| Padding | `p-6` (24px) |
| Layout | `flex flex-col items-center` |

**Props:**

```ts
interface Props {
  id: string
  title: string
  author: string
  coverColor?: string
  rating: number
  reviews: number
}
```

**Template:**

```vue
<template>
  <NuxtLink
    :to="`/books/${id}`"
    class="w-[360px] bg-white rounded-3xl shadow-md p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow duration-200"
  >
    <BookCover :title="title" :cover-color="coverColor" />

    <div class="text-center mt-2">
      <h3 class="text-[28px] font-semibold text-text-dark font-serif">
        {{ title }}
      </h3>
      <p class="text-muted mt-1">{{ author }}</p>
    </div>

    <BookRating :rating="rating" :reviews="reviews" />
  </NuxtLink>
</template>
```

**Acceptance Criteria:**
- [x] BookCover renders at 190×290px with decorative bottom elements
- [x] BookCard renders at 360px width, white bg, rounded-3xl, shadow-md
- [x] BookRating shows amber stars + review count
- [x] Cards are clickable (`NuxtLink` to `/books/:id`)
- [x] Hover effect: `shadow-lg transition-shadow`

---

## Phase 4 — Category Components ✅ EXECUTADA

**Goal:** Build category chip and horizontal category list.

> **Status:** Executada com sucesso em 2026-07-16. Componentes criados:
> - `app/components/category/category-chip.vue` — Chip com estados active/inactive
> - `app/components/category/category-list.vue` — Lista horizontal com emit `select`
>
> **Detalhes:**
> - `CategoryChip` usa `<button>` com classes Tailwind (bg-sidebar text-white para active, bg-white border stone-200 para inactive)
> - `CategoryList` recebe `DiscoveryCategory[]` e `activeId`, emite `select(categoryId)`
> - Segue padrão kebab-case e `<script setup lang="ts">` dos componentes existentes

### 4.1 `CategoryChip.vue`

**Path:** `app/components/category/CategoryChip.vue`

**Props:**

```ts
interface Props {
  label: string
  active?: boolean
}
```

| State | Style |
|-------|-------|
| Inactive | `bg-white border border-stone-200 text-text-dark rounded-full px-7 py-3 hover:bg-stone-100 transition` |
| Active | `bg-sidebar text-white rounded-full px-7 py-3` |

Uses `NuxtLink` or emits `click` event. Renders as a `<button>` or `<NuxtLink>` depending on parent context.

### 4.2 `CategoryList.vue`

**Path:** `app/components/category/CategoryList.vue`

**Props:**

```ts
interface Props {
  categories: Array<{ id: string; label: string }>
  activeId: string
}
```

**Emits:** `select(categoryId: string)`

**Template:**

```vue
<template>
  <div class="flex flex-wrap gap-3 overflow-x-auto">
    <CategoryChip
      v-for="cat in categories"
      :key="cat.id"
      :label="cat.label"
      :active="activeId === cat.id"
      @click="$emit('select', cat.id)"
    />
  </div>
</template>
```

On mobile: horizontal scroll with `overflow-x-auto` and `flex-nowrap`.

**Acceptance Criteria:**
- [x] Chip renders with correct active/inactive states
- [x] List renders horizontally, wraps on desktop, scrolls on mobile
- [x] Active chip has `bg-sidebar text-white`
- [x] Inactive chip has white bg, stone border, hover state

---

## Phase 5 — Page Assembly ✅ EXECUTADA

**Goal:** Compose all components into the discovery page.

> **Status:** Executada com sucesso em 2026-07-16. Arquivos criados/modificados:
> - `app/pages/discover.vue` — Página principal com layout discovery, grid responsivo, loading skeleton, estados vazios/erro, e infinite scroll via IntersectionObserver
> - `app/composables/use-discovery-books.ts` — Atualizado para mapear `review_count` da API para campo `reviews` (compatibilidade com `BookDiscoveryCard`)
> - `app/types/discovery.ts` — Adicionado interface `DiscoveryBook` com campo `reviews`
>
> **Detalhes:**
> - Página usa `definePageMeta({ layout: 'discovery' })` para aplicar o layout com sidebar/header
> - Grid responsivo: `grid-cols-1 md:grid-cols-2 xl:grid-cols-4`
> - Infinite scroll via `IntersectionObserver` com `rootMargin: 400px`
> - Loading skeleton com 8 placeholders animados (`animate-pulse`)
> - Estados de erro com botão "Tentar novamente" e vazio com mensagem informativa
> - Botão "Carregar mais" visível quando `hasMore` e não está carregando
> - Componentes usam nomes PascalCase do Nuxt auto-import: `BookDiscoveryCard`, `CategoryCategoryList`, `SharedCommonSectionTitle`, `SharedUiButton`
>
> **Correções pós-review:**
> - Alinhamento de categorias: `DISCOVERY_CATEGORIES`, `BookCategory`, e `BOOK_CATEGORIES` atualizados para usar valores em inglês que correspondem ao banco de dados (`"Sci-Fi"`, `"Fantasy"`, etc.) em vez de português (`"Ficção Científica"`, `"Fantasia"`, etc.)
> - Corrigido bug no server mapper que silenciosamente defaultava todos os livros não-"Drama" para `"Drama"` devido à incompatibilidade de categorias
> - `useDiscoveryBooks` atualizado para mapear `review_count` da API para campo `reviews` (compatibilidade com `BookDiscoveryCard`)
> - Adicionado interface `DiscoveryBook` em `app/types/discovery.ts`

### 5.1 Create `app/pages/discover.vue`

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'discovery',
  title: 'Descobrir',
})

const {
  books,
  isLoading,
  error,
  searchQuery,
  selectedCategory,
  setCategory,
  setSearch,
  loadMore,
  hasMore,
  isLoadingMore,
} = useDiscoveryBooks()

const { categories } = useDiscoveryCategories()
</script>
```

**Template structure:**

```vue
<template>
  <div class="flex flex-col gap-12">
    <!-- Section: Recommended -->
    <section>
      <CommonSectionTitle>Recomendados para Você</CommonSectionTitle>

      <!-- Category chips -->
      <CategoryCategoryList
        :categories="categories"
        :active-id="selectedCategory"
        class="mt-6"
        @select="setCategory"
      />

      <!-- Book grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-8">
        <BookBookCard
          v-for="book in books"
          :key="book.id"
          v-bind="book"
        />
      </div>

      <!-- Loading skeleton -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-8">
        <div v-for="i in 8" :key="i" class="animate-pulse">
          <div class="w-[360px] h-[430px] bg-gray-200 rounded-3xl" />
        </div>
      </div>

      <!-- Error state -->
      <div v-if="error" class="text-center py-12">
        <p class="text-red-500">{{ error }}</p>
        <CommonBaseButton variant="primary" class="mt-4" @click="fetchBooks">
          Tentar novamente
        </CommonBaseButton>
      </div>

      <!-- Empty state -->
      <div v-if="!isLoading && books.length === 0 && !error" class="text-center py-12">
        <p class="text-muted text-lg">Nenhum livro encontrado</p>
      </div>

      <!-- Load more -->
      <div v-if="hasMore && !isLoading" class="flex justify-center mt-8">
        <CommonBaseButton variant="secondary" :disabled="isLoadingMore" @click="loadMore">
          <span v-if="isLoadingMore">Carregando...</span>
          <span v-else>Carregar mais</span>
        </CommonBaseButton>
      </div>
    </section>
  </div>
</template>
```

### 5.2 Route & Navigation Update

- Add `/discover` route (the page file handles this via Nuxt file-based routing)
- Update sidebar nav to link to `/discover`
- Optionally redirect `/` to `/discover` or keep the landing page

### 5.3 Mock Data for Development

Populate `useDiscoveryBooks` with mock data initially:

```ts
const MOCK_BOOKS: DiscoveryBook[] = [
  { id: '1', title: 'O Músico', author: 'Ruan Valente', coverColor: '#6A4A3A', rating: 5, reviews: 128, category: 'Drama' },
  { id: '2', title: 'Future Waves', author: 'Ana Silva', coverColor: '#2D4A6F', rating: 4, reviews: 89, category: 'Sci-Fi' },
  // ... 8-12 items
]
```

**Acceptance Criteria:**
- [x] `/discover` renders the full layout with sidebar, header, and content
- [x] Section title "Recomendados para Você" displays in serif font
- [x] Category chips filter books reactively
- [x] Book grid shows 4 columns on desktop, 2 on tablet, 1 on mobile
- [x] Loading skeleton renders while data loads
- [x] Empty and error states display correctly

---

## Phase 6 — Responsive Design ✅ EXECUTADA

**Goal:** Ensure full responsiveness across desktop, tablet, and mobile breakpoints.

> **Status:** Executada com sucesso em 2026-07-16. Alterações realizadas:
> - `app/components/book/discovery-card.vue` — Atualizado de `w-[360px]` para `w-full max-w-[360px]` para adaptar ao grid responsivo
> - `app/components/category/category-chip.vue` — Padding ajustado para mobile (`px-5 py-2.5 md:px-7 md:py-3`) e adicionado `whitespace-nowrap`
> - `app/components/layout/app-header.vue` — Altura e padding responsivos (`h-16 md:h-22`, `px-4 md:px-8`)
> - `app/layouts/discovery.vue` — Adicionado `overflow-x-hidden` para prevenir scroll horizontal
> - `app/pages/discover.vue` — Grid com gap responsivo (`gap-4 md:gap-8`) e skeleton responsivo (`w-full max-w-[360px]`)
>
> **Detalhes:**
> - Sidebar: Já implementada com drawer mobile, overlay e transição (Phase 1)
> - Container: Já com `ml-0 xl:ml-80` e padding responsivo (Phase 1)
> - CategoryList: Já com `flex-nowrap md:flex-wrap` e `overflow-x-auto` (Phase 4)
> - Grid: `grid-cols-1 md:grid-cols-2 xl:grid-cols-4` com gaps adaptativos

### 6.1 Desktop (>1280px / `xl`)

- Sidebar: fixed, 320px, fully visible
- Grid: `grid-cols-4`
- Search: full width (740px max)
- Category chips: `flex-wrap`

### 6.2 Tablet (768–1279px / `md` to `lg`)

- Sidebar: collapsed or hidden, toggle via hamburger
- Grid: `grid-cols-2`
- Search: responsive width (`w-full max-w-md`)
- Header: hamburger visible

### 6.3 Mobile (<768px / below `md`)

- Sidebar: off-canvas drawer (toggled by hamburger)
- Overlay backdrop when drawer is open
- Header: simplified, hamburger + logo only
- Grid: `grid-cols-1`
- Category chips: `flex-nowrap overflow-x-auto`
- Book cards: full width (`w-full` instead of `w-[360px]`)

**Acceptance Criteria:**
- [x] Sidebar hidden on mobile, togglable via hamburger
- [x] Grid adapts: 4 → 2 → 1 columns
- [x] Category chips scroll horizontally on mobile
- [x] No horizontal overflow on any screen size
- [x] Touch-friendly tap targets (min 44px) on mobile

---

## Phase 7 — Polish & Integration

**Goal:** Final touches, accessibility, performance, and API readiness.

### 7.1 Accessibility

- All interactive elements have visible focus rings (`focus:ring-2 focus:ring-accent`)
- Sidebar nav uses `<nav>` with `aria-label="Principal"`
- Hamburger button has `aria-label` and `aria-expanded`
- Category chips use `role="tab"` / `role="tabpanel"` pattern or `aria-pressed`
- Book cards have descriptive `aria-label` on links
- Color contrast: white on #34271C passes WCAG AA

### 7.2 Performance

- Lazy-load book cover images when `coverUrl` is provided
- Use `v-memo` on book grid if list is large
- Ensure `IntersectionObserver` for infinite scroll is properly cleaned up
- Prefetch book detail pages on card hover (`<NuxtLink prefetch>`)

### 7.3 Pinia Store (Future-Ready)

Create `app/stores/discovery.ts`:

```ts
export const useDiscoveryStore = defineStore('discovery', () => {
  const books = ref<DiscoveryBook[]>([])
  const category = ref('all')
  const search = ref('')
  // ... actions for fetch, filter, etc.
})
```

Wire composable to store. Keep composable as the public API, store as internal state.

### 7.4 API Integration Prep

- Ensure `useDiscoveryBooks` can switch from mock data to `/api/books` endpoint
- Map existing `ApiBook` → `DiscoveryBook` using a mapper function
- The existing server routes (`/api/books`) already support `category` and `search` query params

### 7.5 Testing Checklist

- [ ] Visual regression: sidebar, header, cards, categories at all breakpoints
- [ ] Keyboard navigation: tab through sidebar, search, categories, cards
- [ ] Screen reader: all sections announced correctly
- [ ] Loading states: skeleton → content → empty/error
- [ ] Infinite scroll: loads more books when scrolling near bottom
- [ ] Search: debounced input updates URL query params
- [ ] Category filter: clicking chip updates grid and URL

---

## File Manifest (New Files)

```
app/
├── components/
│   ├── layout/
│   │   ├── AppSidebar.vue          ← Phase 1.1
│   │   ├── SidebarItem.vue         ← Phase 1.2
│   │   ├── AppHeader.vue           ← Phase 1.3
│   │   └── AppContainer.vue        ← Phase 1.4
│   ├── book/
│   │   ├── discovery-card.vue        ← Phase 3.3 ✅ (renamed from book-card)
│   │   ├── discovery-cover.vue       ← Phase 3.1 ✅ (renamed from book-cover)
│   │   └── discovery-rating.vue      ← Phase 3.2 ✅ (wrapper → SharedUiRatingStars)
│   ├── category/
│   │   ├── CategoryChip.vue        ← Phase 4.1 ✅
│   │   └── CategoryList.vue        ← Phase 4.2 ✅
│   └── shared/
│       ├── common/
│       │   ├── search-input.vue    ← Phase 2.1 ✅
│       │   ├── section-title.vue   ← Phase 2.2 ✅
│       │   └── hamburger-button.vue ← Phase 2.4 ✅
│       └── ui/
│           ├── button.vue          ← Estendido (Phase 2.3)
│           └── rating-stars.vue    ← Estendido (Phase 2.3)
├── composables/
│   ├── use-discovery-books.ts      ← Phase 0.5 ✅ (atualizado Phase 5)
│   └── use-discovery-categories.ts ← Phase 0.5 ✅
├── layouts/
│   └── discovery.vue               ← Phase 1.5
├── pages/
│   └── discover.vue                ← Phase 5.1 ✅
├── stores/
│   └── discovery.ts                ← Phase 7.3
└── types/
    └── discovery.ts                ← Phase 0.4 ✅ (atualizado Phase 5)
```

## Files Modified

| File | Phase | Change |
|------|-------|--------|
| `tailwind.config.ts` | 0.3 | Add full color palette |
| `nuxt.config.ts` | 0.2 | Add Pinia module, optional font |
| `package.json` | 0.1 | New dependencies |
| `app/components/shared/ui/button.vue` | 2.3 | Estendido com variante ghost |
| `app/components/shared/ui/rating-stars.vue` | 2.3 | Estendido com prop reviews |
| `app/components/book/discovery-rating.vue` | 3.2 | Wrapper delegando para SharedUiRatingStars |
| `app/components/dashboard/sidebar.vue` | Fix | z-index overlay corrigido para z-30 |
| `app/types/book.entity.ts` | Fix | BookCategory atualizado para valores em inglês (matching DB) |
| `server/domain/entities/book.entity.ts` | Fix | BookCategory atualizado para valores em inglês (matching DB) |
| `app/types/discovery.ts` | 5 | Adicionado DiscoveryBook; IDs das categorias alinhados com DB |
| `app/composables/use-discovery-books.ts` | 5 | Mapeamento ApiBook→DiscoveryBook com campo reviews |
| `app/composables/use-discovery-categories.ts` | 5 | Default category atualizado para "All" |

## Dependency Graph

```
Phase 0 ──→ Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 5
                    └──→ Phase 4 ────────────────┘
                                                ↓
                                          Phase 6 ──→ Phase 7
```

Phases 2, 3, and 4 can be developed in parallel once Phase 1 is complete. Phase 5 (page assembly) depends on all of 2, 3, 4. Phase 6 and 7 are sequential polish phases.

---

## Effort Estimate

| Phase | Estimated Effort |
|-------|-----------------|
| Phase 0 — Foundation | ~30 min |
| Phase 1 — Layout Shell | ~1.5 hours |
| Phase 2 — Common Components | ~1 hour |
| Phase 3 — Book Components | ~1 hour |
| Phase 4 — Category Components | ~30 min |
| Phase 5 — Page Assembly | ~1 hour |
| Phase 6 — Responsive Design | ~1.5 hours |
| Phase 7 — Polish & Integration | ~1.5 hours |
| **Total** | **~8.5 hours** |
