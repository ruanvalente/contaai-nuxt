<script setup lang="ts">
interface Props {
  modelValue: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<template>
  <button
    type="button"
    class="xl:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C9A87C]/20 transition-colors"
    :aria-expanded="modelValue"
    aria-label="Abrir menu de navegação"
    @click="emit('update:modelValue', !modelValue)"
  >
    <LucideMenu v-if="!modelValue" class="w-6 h-6" />
    <LucideX v-else class="w-6 h-6" />
  </button>
</template>
