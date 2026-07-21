<script setup lang="ts">
import type { BookListItem } from '~/types/book.entity'

definePageMeta({
  title: "Minha Sessão",
  layout: "dashboard",
  middleware: 'auth',
})

const { user, isInitialized, loading, initialize } = useAuthStore()

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
  <div v-if="!isInitialized || loading" />

  <div v-else>
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-display font-semibold text-highlight mb-2">
        Minha Sessão
      </h1>
      <p class="text-muted">
        Seus favoritos e histórico de leitura
      </p>
    </div>

    <div v-if="dataLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="i in 6" :key="i">
        <USkeleton class="aspect-[2/3] w-full rounded-lg" />
        <USkeleton class="mt-3 h-4 w-3/4" />
        <USkeleton class="mt-1 h-3 w-1/2" />
      </div>
    </div>

    <div v-else-if="favoriteBooks.length === 0" class="text-center py-20">
      <p class="text-muted text-lg">Nenhum livro na sua sessão</p>
      <p class="text-muted/70 text-sm mt-2">
        Explore obras em destaque e adicione aos favoritos
      </p>
      <UButton
        label="Explorar Obras"
        to="/discover/explore"
        class="mt-6"
      />
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
</template>
