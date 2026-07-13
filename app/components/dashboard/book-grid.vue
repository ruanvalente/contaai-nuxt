<script setup lang="ts">
import type { UserBook } from '~/types/user-book'

interface Props {
  books: UserBook[]
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <div>
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
        <div class="h-40 bg-gray-200" />
        <div class="p-4 space-y-3">
          <div class="h-4 bg-gray-200 rounded w-3/4" />
          <div class="h-3 bg-gray-200 rounded w-1/2" />
          <div class="flex gap-2">
            <div class="h-6 bg-gray-200 rounded-full w-20" />
            <div class="h-6 bg-gray-200 rounded-full w-16" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <DashboardBookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </div>
</template>
