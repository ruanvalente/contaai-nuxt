<script setup lang="ts">
interface Props {
  isFavorited: boolean
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <UButton
    :icon="isFavorited ? 'i-lucide-heart' : 'i-lucide-heart'"
    :color="isFavorited ? 'error' : 'neutral'"
    variant="ghost"
    size="sm"
    :padded="false"
    :loading="isLoading"
    @click="emit('click')"
  />
</template>
