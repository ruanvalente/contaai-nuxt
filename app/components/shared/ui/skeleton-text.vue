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
  <div
    :class="['animate-pulse bg-gray-200 rounded', className]"
    :style="{ width, height }"
  />
</template>
