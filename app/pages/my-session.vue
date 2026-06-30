<script setup lang="ts">
import type { BookListItem } from '~/types/book.entity'

definePageMeta({
  title: "Minha Sessão",
  middleware: 'auth',
})

const { user, isInitialized, isLoading, initialize } = useAuthStore()

const favoriteBooks = ref<BookListItem[]>([])
const dataLoading = ref(true)

onMounted(() => {
  initialize()
})

onMounted(async () => {
  dataLoading.value = true
  try {
    await new Promise(r => setTimeout(r, 600))
  } finally {
    dataLoading.value = false
  }
})
</script>

<template>
  <div v-if="!isInitialized || isLoading" class="min-h-screen bg-primary-100 pt-20" />

  <div v-else class="min-h-screen bg-primary-100 pt-20">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-2">
        Minha Sessão
      </h1>
      <p class="text-gray-600 mb-10">
        Seus favoritos e histórico de leitura
      </p>

      <div v-if="dataLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-gray-300 rounded-lg w-full aspect-[2/3]" />
          <div class="mt-3 h-4 bg-gray-300 rounded w-3/4" />
          <div class="mt-1 h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>

      <div v-else-if="favoriteBooks.length === 0" class="text-center py-20">
        <p class="text-gray-500 text-lg">Nenhum livro na sua sessão</p>
        <p class="text-gray-400 text-sm mt-2">
          Explore obras em destaque e adicione aos favoritos
        </p>
        <NuxtLink
          to="/explore"
          class="inline-block mt-6 px-6 py-3 bg-accent-500 text-white rounded-full font-medium hover:bg-accent-600 transition-colors"
        >
          Explorar Obras
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div v-for="book in favoriteBooks" :key="book.id">
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
