<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";

interface Props {
  items: SelectItem[];
}

defineProps<Props>();

const selectedCategory = defineModel<string>();
</script>

<template>
  <USelect
    v-model="selectedCategory"
    :items="items"
    placeholder="Selecione uma categoria"
    class="w-full"
    option-attribute="label"
    value-attribute="value"
  />
</template>
