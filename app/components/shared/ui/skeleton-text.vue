<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  className: '',
})
</script>

<template>
  <USkeleton
    :class="className"
    :style="{ width, height }"
  />
</template>
