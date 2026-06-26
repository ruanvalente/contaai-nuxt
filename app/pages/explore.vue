<script setup lang="ts">
import { CATEGORIES } from "~/types/book.entity";
import type { Category } from "~/types/book.entity";

definePageMeta({
  title: "Explorar",
  keepalive: true,
});

const route = useRoute();
const router = useRouter();

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
  <div class="min-h-screen bg-primary-100 pt-20">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-accent-500 transition-colors mb-6 text-sm"
        @click.prevent="router.back()"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        Voltar
      </NuxtLink>

      <div
        class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1
            class="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-2"
          >
            Explorar
          </h1>
          <p class="text-gray-600">Descubra novas histórias e autores</p>
        </div>

        <form
          method="GET"
          action="/explore"
          class="relative w-full sm:w-72"
          @submit.prevent="onSearchSubmit"
        >
          <input
            type="hidden"
            name="category"
            :value="route.query.category || ''"
          />
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            v-model="searchQuery"
            name="search"
            type="text"
            placeholder="Buscar livros..."
            class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow"
          />
        </form>
      </div>

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
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            currentCategory === cat
              ? 'bg-accent-500 text-white'
              : 'bg-primary-200 text-gray-700 hover:bg-primary-300',
          ]"
        >
          {{ cat === "All" ? "Todas" : cat }}
        </NuxtLink>
      </div>

      <div
        v-if="isLoading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div v-for="i in 10" :key="i" class="animate-pulse">
          <div class="bg-gray-300 rounded-lg w-full aspect-[2/3]" />
          <div class="mt-3 h-4 bg-gray-300 rounded w-3/4" />
          <div class="mt-1 h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 text-lg">{{ error }}</p>
        <button
          class="mt-4 px-6 py-2 bg-accent-500 text-white rounded-full text-sm font-medium hover:bg-accent-600 transition-colors"
          @click="onRetry"
        >
          Tentar novamente
        </button>
      </div>

      <div v-else-if="books.length === 0" class="text-center py-20">
        <p class="text-gray-500 text-lg">Nenhuma obra encontrada</p>
        <p class="text-gray-400 text-sm mt-2">
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
          <div
            class="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"
          />
        </div>

        <div v-if="hasMore" ref="sentinel" class="h-4" />
      </div>
    </div>
  </div>
</template>
