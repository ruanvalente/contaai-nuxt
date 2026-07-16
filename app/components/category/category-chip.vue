<script setup lang="ts">
interface Props {
  label: string;
  active?: boolean;
}

withDefaults(defineProps<Props>(), {
  active: false,
});
</script>

<template>
  <button
    type="button"
    :aria-pressed="active"
    :class="[
      'rounded-full px-5 py-2.5 md:px-7 md:py-3 text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
      active
        ? 'bg-sidebar text-white'
        : 'bg-white border border-stone-200 text-text-dark hover:bg-stone-100',
    ]"
  >
    {{ label }}
  </button>
</template>
