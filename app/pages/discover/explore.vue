<script setup lang="ts">
import { CATEGORIES } from "~/types/book.entity";
import type { Category } from "~/types/book.entity";

definePageMeta({
  title: "Explorar",
  layout: "dashboard",
  keepalive: true,
});

const route = useRoute();

const {
  books,
  isLoading,
  error,
  fetchBooks,
  loadMore,
  hasMore,
  isLoadingMore,
} = useBooks();

const currentCategory = computed<Category>(
  () => (route.query.category as Category) || "All",
);
const searchQuery = ref((route.query.search as string) || "");

watch(
  () => route.query.search as string | undefined,
  (val) => {
    searchQuery.value = val ?? "";
  },
);

let searchTimer: ReturnType<typeof setTimeout>;
watch(searchQuery, (val) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    if (val !== ((route.query.search as string) ?? "")) {
      navigateTo({ query: { ...route.query, search: val || undefined } });
    }
  }, 300);
});

function onSearchSubmit() {
  clearTimeout(searchTimer);
  navigateTo({
    query: { ...route.query, search: searchQuery.value || undefined },
  });
}

function onRetry() {
  fetchBooks();
}

const sentinel = ref<HTMLElement>();

let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting && hasMore.value && !isLoadingMore.value) {
        loadMore();
      }
    },
    { rootMargin: "400px" },
  );

  watchEffect(() => {
    if (sentinel.value) {
      observer?.observe(sentinel.value);
    }
  });
});

onUnmounted(() => {
  observer?.disconnect();
  clearTimeout(searchTimer);
});
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-display font-semibold text-highlight mb-2">
        Explorar
      </h1>
      <p class="text-muted">Descubra novas histórias e autores</p>
    </div>

    <form
      method="GET"
      action="/discover/explore"
      class="relative w-full sm:w-72 mb-8"
      @submit.prevent="onSearchSubmit"
    >
      <input
        type="hidden"
        name="category"
        :value="route.query.category || ''"
      />
      <UInput
        v-model="searchQuery"
        name="search"
        icon="i-lucide-search"
        placeholder="Buscar livros..."
        class="w-full"
      />
    </form>

    <div class="flex flex-wrap gap-2 mb-10">
      <NuxtLink
        v-for="cat in CATEGORIES"
        :key="cat"
        :to="{
          query: {
            ...route.query,
            category: cat === 'All' ? undefined : cat,
          },
        }"
      >
        <UBadge
          :color="currentCategory === cat ? 'primary' : 'neutral'"
          :variant="currentCategory === cat ? 'solid' : 'subtle'"
          size="lg"
          class="cursor-pointer"
        >
          {{ cat === "All" ? "Todas" : cat }}
        </UBadge>
      </NuxtLink>
    </div>

    <div
      v-if="isLoading"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
    >
      <div v-for="i in 10" :key="i">
        <USkeleton class="aspect-[2/3] w-full rounded-lg" />
        <USkeleton class="mt-3 h-4 w-3/4" />
        <USkeleton class="mt-1 h-3 w-1/2" />
      </div>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <p class="text-error text-lg">{{ error }}</p>
      <UButton
        label="Tentar novamente"
        color="primary"
        variant="solid"
        class="mt-4"
        @click="onRetry"
      />
    </div>

    <div v-else-if="books.length === 0" class="text-center py-20">
      <p class="text-muted text-lg">Nenhuma obra encontrada</p>
      <p class="text-muted/70 text-sm mt-2">
        {{
          searchQuery
            ? "Tente ajustar sua busca ou filtro"
            : "Em breve novas histórias serão publicadas"
        }}
      </p>
    </div>

    <div v-else>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div v-for="book in books" :key="book.id">
          <SharedUiBookCard
            :id="book.id"
            :title="book.title"
            :author="book.author"
            :cover-url="book.coverUrl"
            :cover-color="book.coverColor"
            :rating="book.rating"
          />
        </div>
      </div>

      <div v-if="isLoadingMore" class="flex justify-center py-8">
        <UIcon name="i-lucide-loader-2" class="h-8 w-8 animate-spin text-primary" />
      </div>

      <div v-if="hasMore" ref="sentinel" class="h-4" />
    </div>
  </div>
</template>
