<script setup lang="ts">
interface Props {
  isFavorited: boolean
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    :class="[
      'rounded-full p-1.5 transition-colors',
      isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-400',
    ]"
    :disabled="isLoading"
    @click="emit('click')"
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      :fill="isFavorited ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  </button>
</template>
