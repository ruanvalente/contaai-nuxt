<script setup lang="ts">
interface Props {
  name: 'book-open' | 'users' | 'message'
}

defineProps<Props>()

const iconMap: Record<string, string> = {
  'book-open': 'i-lucide-book-open',
  'users': 'i-lucide-users',
  'message': 'i-lucide-message-square',
}
</script>

<template>
  <UIcon :name="iconMap[name] || 'i-lucide-circle'" class="w-5 h-5" />
</template>
