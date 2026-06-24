<script setup lang="ts">
interface Props {
  title: string
  coverUrl: string
  coverColor: string
  size?: 'sm' | 'md' | 'lg'
}

defineProps<Props>()
</script>

<template>
  <div
    class="rounded-lg overflow-hidden flex items-center justify-center shadow-md"
    :style="{ backgroundColor: coverColor || '#C9A87C' }"
  >
    <span class="text-white text-center font-semibold px-2 leading-tight line-clamp-4">
      {{ title }}
    </span>
  </div>
</template>
