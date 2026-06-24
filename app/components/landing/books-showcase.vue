<script setup lang="ts">
import type { BookListItem } from '~/types/book.entity'
import { CATEGORIES } from '~/types/book.entity'
import type { Category } from '~/types/book.entity'

interface Props {
  initialBooks: BookListItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  bookSelect: [book: BookListItem]
}>()

const books = ref<BookListItem[]>(props.initialBooks)
const selectedCategory = ref<Category>('All')
const isLoading = ref(false)

const handleCategoryChange = async (category: Category) => {
  selectedCategory.value = category

  if (category === 'All') {
    books.value = props.initialBooks
    return
  }

  isLoading.value = true
  try {
    books.value = props.initialBooks.filter(book => book.category === category)
  } catch (error) {
    console.error('Failed to filter books:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="py-20 bg-primary-200 relative overflow-hidden">
    <SharedUiContainer>
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
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
                : 'bg-primary-100 text-gray-700 hover:bg-primary-300'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center gap-4 md:gap-8 overflow-x-auto pb-8 px-4">
        <div v-for="i in 5" :key="i" class="shrink-0 animate-pulse">
          <div class="w-32 sm:w-40">
            <div class="bg-gray-300 rounded-lg w-full aspect-[2/3]" />
            <div class="mt-2 h-4 bg-gray-300 rounded w-3/4" />
            <div class="mt-1 h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>

      <div v-else-if="books.length > 0" class="flex items-center justify-center gap-4 md:gap-8 overflow-x-auto pb-8 px-4 scrollbar-hide">
        <div
          v-for="(book, index) in books.slice(0, 12)"
          :key="book.id"
          class="shrink-0"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div
            @click="emit('bookSelect', book)"
            class="cursor-pointer"
          >
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

      <div v-else class="text-center py-12">
        <p class="text-gray-500">
          {{ selectedCategory === 'All' ? 'Nenhum livro encontrado' : `Nenhum livro encontrado em ${selectedCategory}` }}
        </p>
      </div>

      <div v-if="books.length > 0" class="mt-12 text-center">
        <NuxtLink
          to="/explore"
          class="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white rounded-full font-medium hover:bg-accent-600 transition-colors"
        >
          Ver todos os livros
          <span>→</span>
        </NuxtLink>
      </div>
    </SharedUiContainer>
  </section>
</template>
