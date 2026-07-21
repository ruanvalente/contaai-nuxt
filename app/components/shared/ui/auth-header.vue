<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
}

defineProps<Props>()
</script>

<template>
  <div class="mb-10 text-center">
    <h1 class="mb-3 font-serif text-4xl font-semibold text-highlight">
      {{ title }}
    </h1>
    <p class="text-lg text-muted">
      {{ subtitle }}
    </p>
  </div>
</template>
