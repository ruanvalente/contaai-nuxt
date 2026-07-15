<script setup lang="ts">
interface Props {
  rating: number
  reviews?: number
  size?: 'sm' | 'md'
  showValue?: boolean
  showReviews?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'sm',
  showValue: false,
  showReviews: false,
  reviews: 0,
})
</script>

<template>
  <div class="flex items-center gap-1.5">
    <span
      v-for="i in 5"
      :key="i"
      :class="[
        size === 'sm' ? 'text-xs' : 'text-sm',
        i <= Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'
      ]"
    >
      {{ i <= Math.round(rating) ? '★' : '☆' }}
    </span>
    <span v-if="showValue" class="text-xs text-gray-500 ml-1">
      {{ rating.toFixed(1) }}
    </span>
    <span v-if="showReviews && reviews > 0" class="text-xs text-[#6B7280]">
      ({{ reviews }})
    </span>
  </div>
</template>
