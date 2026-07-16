<script setup lang="ts">
import { Menu } from "lucide-vue-next";

interface Props {
  sidebarOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sidebarOpen: false,
});

const emit = defineEmits<{
  toggleSidebar: [];
}>();
</script>

<template>
  <header
    class="sticky top-0 z-20 h-16 md:h-22 bg-white border-b border-stone-200 px-4 md:px-8 flex items-center justify-between"
  >
    <!-- Mobile hamburger -->
    <button
      class="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition"
      :aria-label="sidebarOpen ? 'Fechar menu' : 'Abrir menu'"
      :aria-expanded="sidebarOpen"
      @click="emit('toggleSidebar')"
    >
      <Menu class="w-6 h-6 text-text-dark" />
    </button>

    <!-- Placeholder for SearchInput (Phase 2) -->
    <div class="flex-1 max-w-[740px] mx-auto" />

    <!-- User avatar placeholder -->
    <div
      class="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"
    >
      <span class="text-sm font-medium text-primary">U</span>
    </div>
  </header>
</template>
