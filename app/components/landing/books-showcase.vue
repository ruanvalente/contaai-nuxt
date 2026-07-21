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
  <section class="py-20 bg-surface-alt relative overflow-hidden">
    <SharedUiContainer>
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-display font-semibold text-highlight mb-4">
          Obras em Destaque
        </h2>
        <p class="text-muted max-w-xl mx-auto">
          Explore as contribuições mais recentes da nossa comunidade literária
        </p>
      </div>

      <div class="flex justify-center mb-8">
        <div class="flex flex-wrap gap-2 justify-center">
          <UBadge
            v-for="category in CATEGORIES"
            :key="category"
            :color="selectedCategory === category ? 'primary' : 'neutral'"
            :variant="selectedCategory === category ? 'solid' : 'subtle'"
            size="lg"
            class="cursor-pointer"
            @click="handleCategoryChange(category)"
          >
            {{ category }}
          </UBadge>
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
        <p class="text-muted">
          {{
            selectedCategory === "All"
              ? "Nenhum livro encontrado"
              : `Nenhum livro encontrado em ${selectedCategory}`
          }}
        </p>
      </div>

      <div v-if="books.length > 0" class="mt-12 text-center">
        <UButton
          to="/discover/explore"
          label="Ver todos os livros"
          icon="i-lucide-arrow-right"
          class="px-6 py-3"
        />
      </div>
    </SharedUiContainer>
  </section>
</template>
