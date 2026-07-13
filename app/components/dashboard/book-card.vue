<script setup lang="ts">
import type { UserBook } from '~/types/user-book'

interface Props {
  book: UserBook
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const statusLabel = (status: string) => {
  switch (status) {
    case 'published':
      return 'Publicado'
    case 'draft':
      return 'Rascunho'
    default:
      return status
  }
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    <div
      class="relative h-40 flex items-center justify-center p-4"
      :style="{ backgroundColor: book.cover_color || '#C9A87C' }"
    >
      <img
        v-if="book.cover_url"
        :src="book.cover_url"
        :alt="book.title"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <span v-else class="text-white text-center font-semibold text-lg leading-tight line-clamp-3">
        {{ book.title }}
      </span>
      <span
        :class="[
          'absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium',
          statusBadgeClass(book.status),
        ]"
      >
        {{ statusLabel(book.status) }}
      </span>
    </div>

    <div class="p-4">
      <h3 class="font-semibold text-gray-900 line-clamp-1">{{ book.title }}</h3>
      <p class="text-sm text-gray-500 mt-1">{{ book.author }}</p>

      <div class="flex items-center gap-2 mt-3">
        <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
          {{ book.category }}
        </span>
        <span class="text-xs text-gray-400">
          {{ new Date(book.created_at).toLocaleDateString('pt-BR') }}
        </span>
      </div>

      <div class="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          @click="emit('edit', book.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
        <button
          class="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          @click="emit('delete', book.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
