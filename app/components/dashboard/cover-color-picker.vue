<script setup lang="ts">
import { COVER_COLORS } from '~/types/dashboard'

interface Props {
  modelValue: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="grid grid-cols-8 gap-2">
    <button
      v-for="color in COVER_COLORS"
      :key="color"
      type="button"
      :class="[
        'w-8 h-8 rounded-full transition-transform hover:scale-110',
        modelValue === color ? 'ring-2 ring-offset-2 ring-accent-500' : '',
      ]"
      :style="{ backgroundColor: color }"
      @click="emit('update:modelValue', color)"
    />
  </div>
</template>
