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
      'rounded-full px-7 py-3 text-sm font-medium transition-colors',
      active
        ? 'bg-sidebar text-white'
        : 'bg-white border border-stone-200 text-text-dark hover:bg-stone-100',
    ]"
  >
    {{ label }}
  </button>
</template>
