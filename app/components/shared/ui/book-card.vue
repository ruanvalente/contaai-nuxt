<script setup lang="ts">
interface Props {
  id: string
  title: string
  author: string
  coverUrl?: string
  coverColor: string
  rating: number | null
  isFeatured?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="w-32 sm:w-40 group cursor-pointer">
    <div
      class="relative rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105"
      :style="{ backgroundColor: coverColor || '#C9A87C' }"
    >
      <div
        class="w-full aspect-[2/3] flex items-center justify-center p-2"
      >
        <span class="text-white text-center font-semibold text-sm leading-tight line-clamp-4">
          {{ title }}
        </span>
      </div>
      <div v-if="isFeatured" class="absolute top-2 left-2 bg-accent-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
        Destaque
      </div>
    </div>
    <h3 class="mt-2 text-sm font-semibold text-gray-900 line-clamp-1">
      {{ title }}
    </h3>
    <p class="text-xs text-gray-500">{{ author }}</p>
    <div v-if="rating" class="flex items-center gap-1 mt-1">
      <span class="text-yellow-500 text-xs">★</span>
      <span class="text-xs text-gray-600">{{ rating.toFixed(1) }}</span>
    </div>
  </div>
</template>
