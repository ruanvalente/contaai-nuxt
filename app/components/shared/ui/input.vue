<script setup lang="ts">
interface Props {
  id: string
  label: string
  type?: string
  placeholder?: string
  modelValue?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div>
    <label
      :for="id"
      class="mb-2 block text-sm font-medium text-[#1F2937]"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
      class="w-full h-14 rounded-2xl border border-gray-200 bg-white px-5 text-base text-[#1F2937] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A87C]/20 focus:border-[#C9A87C]/30 transition-colors"
    />
  </div>
</template>
