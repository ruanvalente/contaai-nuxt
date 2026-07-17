<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  variant: 'primary',
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
      variant === 'primary' && 'bg-[#C9A87C] text-white hover:bg-[#B8956A]',
      variant === 'secondary' && 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
      variant === 'ghost' && 'bg-transparent text-[#6B7280] hover:bg-gray-100',
      !variant && 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
    ]"
  >
    <slot />
  </button>
</template>
