<script setup lang="ts">
import { BOOK_CATEGORIES } from '~/types/book.entity'

interface Props {
  modelValue: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)

const selectCategory = (category: string) => {
  emit('update:modelValue', category)
  isOpen.value = false
}

const close = () => {
  isOpen.value = false
}
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-left hover:border-gray-300 transition-colors"
      @click="isOpen = !isOpen"
    >
      <span :class="modelValue ? 'text-gray-900' : 'text-gray-400'">
        {{ modelValue || 'Selecione uma categoria' }}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 text-gray-400 transition-transform', isOpen ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-40" @click="close" />
    </Transition>
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
      >
        <div class="max-h-60 overflow-y-auto">
          <button
            v-for="category in BOOK_CATEGORIES"
            :key="category"
            type="button"
            :class="[
              'w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors',
              modelValue === category ? 'bg-accent-50 text-accent-700' : 'text-gray-700',
            ]"
            @click="selectCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
