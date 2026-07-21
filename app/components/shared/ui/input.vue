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
</script>

<template>
  <UFormField :label="label" :for="id">
    <UInput
      :id="id"
      :type="type"
      :model-value="modelValue"
      :placeholder="placeholder"
      size="xl"
      :ui="{ base: 'rounded-2xl' }"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </UFormField>
</template>
