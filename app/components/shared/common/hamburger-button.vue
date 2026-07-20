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
  <UButton
    icon
    variant="ghost"
    class="xl:hidden"
    :aria-expanded="modelValue"
    aria-label="Abrir menu de navegação"
    @click="emit('update:modelValue', !modelValue)"
  >
    <UIcon :name="modelValue ? 'i-lucide-x' : 'i-lucide-menu'" class="w-6 h-6" />
  </UButton>
</template>
