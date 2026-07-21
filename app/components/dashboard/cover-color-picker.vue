<script setup lang="ts">
interface Props {
  modelValue: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const COVER_COLORS = [
  '#8B4513', '#2F4F4F', '#800020', '#1E3A5F', '#4A4A4A',
  '#4B0082', '#228B22', '#CD853F', '#6B8E23', '#8B0000',
  '#483D8B', '#2F4F4F', '#D2691E', '#708090', '#556B2F',
  '#8B008B',
]
</script>

<template>
  <div class="grid grid-cols-8 gap-2">
    <UButton
      v-for="color in COVER_COLORS"
      :key="color"
      icon
      size="xs"
      :class="[
        'w-8 h-8 rounded-full transition-transform hover:scale-110',
        modelValue === color ? 'ring-2 ring-offset-2 ring-primary' : '',
      ]"
      :style="{ backgroundColor: color }"
      @click="emit('update:modelValue', color)"
    />
  </div>
</template>
