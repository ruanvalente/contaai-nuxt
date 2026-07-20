<script setup lang="ts">
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
    class="sticky top-0 z-20 h-16 md:h-22 bg-surface border-b border-default px-4 md:px-8 flex items-center justify-between"
  >
    <!-- Mobile hamburger -->
    <UButton
      icon="i-lucide-menu"
      variant="ghost"
      class="xl:hidden"
      :aria-label="sidebarOpen ? 'Fechar menu' : 'Abrir menu'"
      :aria-expanded="sidebarOpen"
      @click="emit('toggleSidebar')"
    />

    <!-- Placeholder for SearchInput (Phase 2) -->
    <div class="flex-1 max-w-[740px] mx-auto" />

    <!-- User avatar placeholder -->
    <UAvatar
      alt="U"
      size="md"
      :ui="{ root: 'bg-accent/20' }"
    />
  </header>
</template>
