<script setup lang="ts">
interface Props {
  rating: number
  size?: 'sm' | 'md'
  showValue?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'sm',
  showValue: false,
})
</script>

<template>
  <div class="flex items-center gap-1">
    <span
      v-for="i in 5"
      :key="i"
      :class="[
        size === 'sm' ? 'text-xs' : 'text-sm',
        i <= Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'
      ]"
    >
      ★
    </span>
    <span v-if="showValue" class="text-xs text-gray-500 ml-1">
      {{ rating.toFixed(1) }}
    </span>
  </div>
</template>
