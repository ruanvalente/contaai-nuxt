<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
})
</script>

<template>
  <UBadge
    :color="variant === 'primary' ? 'primary' : 'neutral'"
    :variant="variant === 'primary' ? 'subtle' : 'outline'"
    size="sm"
  >
    <slot />
  </UBadge>
</template>
