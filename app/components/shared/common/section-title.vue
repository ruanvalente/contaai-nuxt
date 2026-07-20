<script setup lang="ts">
interface Props {
  tag?: "h1" | "h2" | "h3";
}

withDefaults(defineProps<Props>(), {
  tag: "h2",
});
</script>

<template>
  <component
    :is="tag"
    class="font-serif font-bold text-[40px] text-highlight leading-tight"
  >
    <slot />
  </component>
</template>
