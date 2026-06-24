<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="w-full h-16 rounded-full bg-[#C9A87C] text-base font-semibold text-white transition-colors hover:bg-[#B8956A] disabled:cursor-not-allowed disabled:opacity-50"
  >
    <slot />
  </button>
</template>
