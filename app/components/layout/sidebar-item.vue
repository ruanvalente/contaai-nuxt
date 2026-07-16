<script setup lang="ts">
import { Compass, Grid3X3, BookOpen, Download, Heart } from "lucide-vue-next";

interface Props {
  icon: string;
  label: string;
  href: string;
  active: boolean;
}

const { active, icon } = defineProps<Props>();

const emit = defineEmits<{
  navigate: [];
}>();

const iconMap: Record<string, any> = {
  Compass,
  Grid3X3,
  BookOpen,
  Download,
  Heart,
};

const iconComponent = computed(() => iconMap[icon] || Compass);

function onClick() {
  emit('navigate');
}
</script>

<template>
  <NuxtLink
    :to="href"
    :class="[
      'flex items-center gap-4 px-6 py-4 rounded-2xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-sidebar',
      active ? 'bg-accent text-white' : 'text-accent hover:bg-sidebar-hover',
    ]"
    @click="onClick"
  >
    <component :is="iconComponent" class="w-5 h-5" />
    <span class="font-medium text-sm">{{ label }}</span>
  </NuxtLink>
</template>
