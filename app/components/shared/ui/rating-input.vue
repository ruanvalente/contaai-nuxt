<script setup lang="ts">
interface Props {
  bookId: string
  currentRating: number
  userRating: number | null
  size?: 'sm' | 'md'
}

defineProps<Props>()

const emit = defineEmits<{
  rate: [value: number]
}>()
</script>

<template>
  <div class="flex items-center gap-1">
    <button
      v-for="i in 5"
      :key="i"
      :class="[
        size === 'sm' ? 'text-xs' : 'text-sm',
        'transition-colors',
        userRating !== null && i <= userRating
          ? 'text-warning'
          : 'text-muted/40 hover:text-warning'
      ]"
      @click="emit('rate', i)"
    >
      ★
    </button>
  </div>
</template>
