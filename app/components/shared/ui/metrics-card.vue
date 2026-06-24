<script setup lang="ts">
interface Props {
  label: string
  value: number | string
  displayValue?: string
}

defineProps<Props>()
</script>

<template>
  <div class="bg-primary-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
    <slot />
    <span class="text-xs text-gray-500 mt-1">{{ label }}</span>
  </div>
</template>
