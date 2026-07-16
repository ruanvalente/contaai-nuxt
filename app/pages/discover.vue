<script setup lang="ts">
definePageMeta({
  layout: "discovery",
  title: "Descobrir",
});

const {
  books,
  isLoading,
  error,
  searchQuery,
  selectedCategory,
  setCategory,
  setSearch,
  fetchBooks,
  loadMore,
  hasMore,
  isLoadingMore,
} = useDiscoveryBooks();

const { categories } = useDiscoveryCategories();

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
});
</script>

<template>
  <div class="flex flex-col gap-12">
    <section>
      <SharedCommonSectionTitle>Recomendados para Você</SharedCommonSectionTitle>

      <CategoryCategoryList
        :categories="categories"
        :active-id="selectedCategory"
        class="mt-6"
        @select="setCategory"
      />

      <div
        v-if="isLoading"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-8"
      >
        <div v-for="i in 8" :key="i" class="animate-pulse">
          <div class="w-[360px] h-[430px] bg-gray-200 rounded-3xl" />
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500">{{ error }}</p>
        <SharedUiButton variant="primary" class="mt-4" @click="fetchBooks">
          Tentar novamente
        </SharedUiButton>
      </div>

      <div
        v-else-if="books.length === 0"
        class="text-center py-12"
      >
        <p class="text-[#6B7280] text-lg">Nenhum livro encontrado</p>
      </div>

      <template v-else>
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-8"
        >
          <BookDiscoveryCard
            v-for="book in books"
            :key="book.id"
            :id="book.id"
            :title="book.title"
            :author="book.author"
            :cover-color="book.coverColor"
            :rating="book.rating"
            :reviews="book.reviews"
          />
        </div>

        <div v-if="hasMore && !isLoading" class="flex justify-center mt-8">
          <SharedUiButton
            variant="secondary"
            :disabled="isLoadingMore"
            @click="loadMore"
          >
            <span v-if="isLoadingMore">Carregando...</span>
            <span v-else>Carregar mais</span>
          </SharedUiButton>
        </div>

        <div v-if="hasMore" ref="sentinel" class="h-4" />
      </template>
    </section>
  </div>
</template>
