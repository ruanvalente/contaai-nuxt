<script setup lang="ts">
import type { DiscoveryCategory } from "~/types/discovery";

interface Props {
  categories: DiscoveryCategory[];
  activeId: string;
}

defineProps<Props>();

const emit = defineEmits<{
  select: [categoryId: string];
}>();
</script>

<template>
  <div class="flex flex-nowrap md:flex-wrap gap-3 overflow-x-auto">
    <CategoryCategoryChip
      v-for="cat in categories"
      :key="cat.id"
      :label="cat.label"
      :active="activeId === cat.id"
      @click="emit('select', cat.id)"
    />
  </div>
</template>
