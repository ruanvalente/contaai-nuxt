<script setup lang="ts">
import { BookOpen } from "lucide-vue-next";

interface Props {
  open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emit = defineEmits<{
  close: [];
}>();

const route = useRoute();

const navItems = [
  { icon: "Compass", label: "Descobrir", href: "/discover" },
  { icon: "Grid3X3", label: "Categorias", href: "/categories" },
  { icon: "BookOpen", label: "Minha Biblioteca", href: "/library" },
  { icon: "Download", label: "Downloads", href: "/downloads" },
  { icon: "Heart", label: "Favoritos", href: "/favorites" },
];

const currentRoute = computed(() => route.path);
</script>

<template>
  <!-- Overlay for mobile -->
  <div
    v-if="open"
    class="fixed inset-0 bg-black/50 z-20 xl:hidden"
    @click="emit('close')"
  />

  <aside
    :class="[
      'fixed inset-y-0 left-0 z-30 w-80 bg-sidebar flex flex-col p-6 gap-5 transition-transform duration-300 overflow-y-auto',
      open ? 'translate-x-0' : '-translate-x-full xl:translate-x-0',
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3">
      <BookOpen class="w-8 h-8 text-white" />
      <span class="font-semibold text-3xl text-white">ContaAI</span>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-1 mt-4" aria-label="Principal">
      <LayoutSidebarItem
        v-for="item in navItems"
        :key="item.label"
        :icon="item.icon"
        :label="item.label"
        :href="item.href"
        :active="currentRoute === item.href"
        @navigate="emit('close')"
      />
    </nav>
  </aside>
</template>
