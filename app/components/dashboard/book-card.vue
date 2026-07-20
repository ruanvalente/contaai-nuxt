<script setup lang="ts">
import type { UserBook } from "~/types/user-book";

interface Props {
  book: UserBook;
}

defineProps<Props>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

const statusColor = (status: string) => {
  switch (status) {
    case "published":
      return "success" as const;
    case "draft":
      return "warning" as const;
    default:
      return "neutral" as const;
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case "published":
      return "Publicado";
    case "draft":
      return "Rascunho";
    default:
      return status;
  }
};
</script>

<template>
  <UCard :ui="{ base: 'overflow-hidden hover:shadow-md transition-shadow' }">
    <template #header>
      <div
        class="relative h-40 flex items-center justify-center p-4 -mx-6 -mt-6 mb-4"
        :style="{ backgroundColor: book.cover_color || '#C9A87C' }"
      >
        <img
          v-if="book.cover_url"
          :src="book.cover_url"
          :alt="book.title"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <span
          v-else
          class="text-white text-center font-semibold text-lg leading-tight line-clamp-3"
        >
          {{ book.title }}
        </span>
        <UBadge
          :color="statusColor(book.status)"
          size="xs"
          class="absolute top-2 right-2"
        >
          {{ statusLabel(book.status) }}
        </UBadge>
      </div>
    </template>

    <h3 class="font-semibold text-highlight line-clamp-1">{{ book.title }}</h3>
    <p class="text-sm text-muted mt-1">{{ book.author }}</p>

    <div class="flex items-center gap-2 mt-3">
      <UBadge color="neutral" variant="subtle" size="xs">
        {{ book.category }}
      </UBadge>
      <span class="text-xs text-muted/70">
        {{ new Date(book.created_at).toLocaleDateString("pt-BR") }}
      </span>
    </div>

    <div class="flex items-center gap-2 mt-4 pt-4 border-t border-default">
      <UButton
        icon="i-lucide-pencil"
        label="Editar"
        variant="ghost"
        class="flex-1 px-4 py-2 text-sm"
        @click="emit('edit', book.id)"
      />
      <UButton
        icon="i-lucide-trash-2"
        color="error"
        variant="ghost"
        @click="emit('delete', book.id)"
      />
    </div>
  </UCard>
</template>
