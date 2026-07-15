<script setup lang="ts">
import type { BookListItem } from "~/types/book.entity";
import { CATEGORIES } from "~/types/book.entity";
import type { Category } from "~/types/book.entity";

interface Props {
  initialBooks: BookListItem[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  bookSelect: [book: BookListItem];
}>();

const selectedCategory = ref<Category>("All");

const books = computed(() => {
  if (selectedCategory.value === "All") return props.initialBooks;
  return props.initialBooks.filter(
    (book) => book.category === selectedCategory.value,
  );
});

const handleCategoryChange = (category: Category) => {
  selectedCategory.value = category;
};
</script>

<template>
  <section class="py-20 bg-primary-200 relative overflow-hidden">
    <SharedUiContainer>
      <div class="text-center mb-8">
        <h2
          class="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4"
        >
          Obras em Destaque
        </h2>
        <p class="text-gray-700 max-w-xl mx-auto">
          Explore as contribuições mais recentes da nossa comunidade literária
        </p>
      </div>

      <div class="flex justify-center mb-8">
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="category in CATEGORIES"
            :key="category"
            @click="handleCategoryChange(category)"
            :class="[
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              selectedCategory === category
                ? 'bg-accent-500 text-white'
                : 'bg-primary-100 text-gray-700 hover:bg-primary-300',
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div
        v-if="books.length > 0"
        class="flex items-center justify-center gap-4 md:gap-8 overflow-x-auto pb-8 px-4 scrollbar-hide"
      >
        <div
          v-for="(book, index) in books.slice(0, 12)"
          :key="book.id"
          class="shrink-0"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div @click="emit('bookSelect', book)" class="cursor-pointer">
            <SharedUiBookCard
              :id="book.id"
              :title="book.title"
              :author="book.author"
              :cover-url="book.coverUrl"
              :cover-color="book.coverColor"
              :rating="book.rating"
              :is-featured="index < 3"
            />
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex items-center justify-center gap-4 md:gap-8 overflow-x-auto pb-8 px-4 scrollbar-hide"
      >
        <p class="text-gray-500">
          {{
            selectedCategory === "All"
              ? "Nenhum livro encontrado"
              : `Nenhum livro encontrado em ${selectedCategory}`
          }}
        </p>
      </div>

      <div v-if="books.length > 0" class="mt-12 text-center">
        <NuxtLink
          to="/dashboard/explore"
          class="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white rounded-full font-medium hover:bg-accent-600 transition-colors"
        >
          Ver todos os livros
          <span>→</span>
        </NuxtLink>
      </div>
    </SharedUiContainer>
  </section>
</template>
