<script setup lang="ts">
import type { AuthUser } from "~/types/auth";

interface Props {
  user: AuthUser | null;
  open: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const route = useRoute();

const navItems = [
  { icon: "i-lucide-home", label: "Discover", to: "/discover" },
  { icon: "i-lucide-search", label: "Explorar", to: "/discover/explore" },
  { icon: "i-lucide-book-open", label: "Minha Sessão", to: "/discover/my-session" },
  { icon: "i-lucide-grid-3x3", label: "Categorias", to: "/discover/categories" },
  { icon: "i-lucide-library", label: "Minha Biblioteca", to: "/discover/library" },
  { icon: "i-lucide-download", label: "Downloads", to: "/discover/downloads" },
  { icon: "i-lucide-heart", label: "Favoritos", to: "/discover/favorites" },
];

function isActive(to: string): boolean {
  if (to === "/discover") return route.path === "/discover";
  return route.path === to || route.path.startsWith(to + "/");
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-30 bg-black/50 lg:hidden"
        @click="emit('close')"
      />
    </Transition>
  </Teleport>

  <aside
    :class="[
      'fixed top-16 left-0 bottom-0 z-40 w-64 transform transition-transform duration-300 ease-in-out',
      open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
    :style="{ backgroundColor: '#34271C' }"
  >
    <nav class="flex flex-col h-full p-4">
      <div class="flex-1 space-y-1">
        <UButton
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :icon="item.icon"
          :color="isActive(item.to) ? 'primary' : 'neutral'"
          :variant="isActive(item.to) ? 'solid' : 'ghost'"
          :class="[
            'w-full justify-start gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive(item.to) ? 'text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
          ]"
          @click="emit('close')"
        >
          {{ item.label }}
        </UButton>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
