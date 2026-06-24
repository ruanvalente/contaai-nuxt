<script setup lang="ts">
import type { BookListItem } from '~/types/book.entity'
import { CATEGORIES } from '~/types/book.entity'
import type { Category } from '~/types/book.entity'

const router = useRouter()

const books = ref<BookListItem[]>([])
const selectedCategory = ref<Category>('All')
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  try {
    // TODO: fetch books from API
    await new Promise(r => setTimeout(r, 600))
  } finally {
    isLoading.value = false
  }
})

const filteredBooks = computed(() => {
  if (selectedCategory.value === 'All') return books.value
  return books.value.filter(b => b.category === selectedCategory.value)
})
</script>

<template>
  <div class="min-h-screen bg-primary-100 pt-20">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <button
        class="inline-flex items-center gap-2 text-gray-600 hover:text-accent-500 transition-colors mb-6 text-sm"
        @click="router.back()"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>

      <h1 class="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-2">
        Explorar
      </h1>
      <p class="text-gray-600 mb-8">
        Descubra novas histórias e autores
      </p>

      <div class="flex flex-wrap gap-2 mb-10">
        <button
          v-for="cat in CATEGORIES"
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === cat
              ? 'bg-accent-500 text-white'
              : 'bg-primary-200 text-gray-700 hover:bg-primary-300'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div v-for="i in 10" :key="i" class="animate-pulse">
          <div class="bg-gray-300 rounded-lg w-full aspect-[2/3]" />
          <div class="mt-3 h-4 bg-gray-300 rounded w-3/4" />
          <div class="mt-1 h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>

      <div v-else-if="filteredBooks.length === 0" class="text-center py-20">
        <p class="text-gray-500 text-lg">Nenhuma obra encontrada</p>
        <p class="text-gray-400 text-sm mt-2">Em breve novas histórias serão publicadas</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div v-for="book in filteredBooks" :key="book.id">
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
    </div>
  </div>
</template>
