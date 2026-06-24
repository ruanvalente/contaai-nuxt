<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full font-medium',
      variant === 'primary'
        ? 'bg-accent-100 text-accent-700'
        : 'bg-gray-100 text-gray-700',
    ]"
  >
    <slot />
  </span>
</template>
