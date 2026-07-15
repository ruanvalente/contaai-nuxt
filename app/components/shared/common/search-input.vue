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
    <div
      class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
    >
      <LucideSearch class="w-5 h-5 text-gray-400" />
    </div>
    <input
      type="text"
      :value="localValue"
      :placeholder="placeholder"
      @input="onInput"
      class="w-full h-[46px] rounded-full border border-[#DDD] bg-white pl-12 pr-5 text-base text-[#1F2937] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A87C]/20 focus:border-[#C9A87C]/30 transition-colors"
    />
  </div>
</template>
