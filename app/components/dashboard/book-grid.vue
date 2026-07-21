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
      <div v-for="i in 8" :key="i" class="bg-surface rounded-xl border border-default overflow-hidden animate-pulse">
        <USkeleton class="h-40 w-full" />
        <div class="p-4 space-y-3">
          <USkeleton class="h-4 w-3/4" />
          <USkeleton class="h-3 w-1/2" />
          <div class="flex gap-2">
            <USkeleton class="h-6 rounded-full w-20" />
            <USkeleton class="h-6 rounded-full w-16" />
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
