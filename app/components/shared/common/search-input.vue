<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

interface Props {
  modelValue: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Buscar livros...",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val;
  },
);

const debouncedEmit = useDebounceFn((value: string) => {
  emit("update:modelValue", value);
}, 300);

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  localValue.value = target.value;
  debouncedEmit(target.value);
}
</script>

<template>
  <div class="relative w-full max-w-[740px]">
    <UInput
      :model-value="localValue"
      :placeholder="placeholder"
      icon="i-lucide-search"
      size="xl"
      :ui="{
        base: 'rounded-full',
        leadingIcon: 'text-muted/70',
      }"
      @input="onInput"
    />
  </div>
</template>
