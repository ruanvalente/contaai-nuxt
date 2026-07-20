<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  variant: 'primary',
  loading: false,
})
</script>

<template>
  <UButton
    :type="type"
    :disabled="disabled"
    :loading="loading"
    :color="variant === 'primary' ? 'primary' : variant === 'ghost' ? 'neutral' : 'neutral'"
    :variant="variant === 'ghost' ? 'ghost' : variant === 'secondary' ? 'outline' : 'solid'"
    :ui="{ rounded: 'rounded-full' }"
  >
    <slot />
  </UButton>
</template>
