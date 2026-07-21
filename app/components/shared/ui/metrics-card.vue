<script setup lang="ts">
interface Props {
  label: string
  value: number | string
  displayValue?: string
}

defineProps<Props>()
</script>

<template>
  <UCard
    :ui="{
      base: 'rounded-xl p-3 flex flex-col items-center justify-center text-center',
      background: 'bg-primary-100/50',
    }"
  >
    <slot />
    <span class="text-xs text-muted mt-1">{{ label }}</span>
  </UCard>
</template>
