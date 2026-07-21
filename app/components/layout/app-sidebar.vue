<script setup lang="ts">
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
  { icon: "i-lucide-compass", label: "Descobrir", href: "/discover" },
  { icon: "i-lucide-grid-3x3", label: "Categorias", href: "/categories" },
  { icon: "i-lucide-book-open", label: "Minha Biblioteca", href: "/library" },
  { icon: "i-lucide-download", label: "Downloads", href: "/downloads" },
  { icon: "i-lucide-heart", label: "Favoritos", href: "/favorites" },
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
      'fixed inset-y-0 left-0 z-30 w-80 flex flex-col p-6 gap-5 transition-transform duration-300 overflow-y-auto bg-sidebar',
      open ? 'translate-x-0' : '-translate-x-full xl:translate-x-0',
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3">
      <UIcon name="i-lucide-book-open" class="w-8 h-8 text-white" />
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
