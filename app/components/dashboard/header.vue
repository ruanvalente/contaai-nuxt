<script setup lang="ts">
import type { AuthUser } from "~/types/auth";

interface Props {
  user: AuthUser | null;
  loggingOut?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  toggleSidebar: [];
  logout: [];
}>();

const dropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement>();

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function closeDropdown() {
  dropdownOpen.value = false;
}

function onClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-4 sm:px-6 bg-sidebar">
    <UButton
      icon="i-lucide-menu"
      variant="ghost"
      color="neutral"
      class="lg:hidden text-white/70 hover:text-white hover:bg-white/10"
      @click="emit('toggleSidebar')"
    />

    <NuxtLink to="/discover" class="hidden lg:flex items-center gap-2 ml-2">
      <div class="h-8 w-8 rounded-lg flex items-center justify-center bg-accent">
        <span class="text-white font-bold text-sm">C</span>
      </div>
      <span class="font-semibold text-lg text-white">ContaAI</span>
    </NuxtLink>

    <div class="flex-1" />

    <div class="flex items-center gap-3">
      <UButton
        icon="i-lucide-bell"
        variant="ghost"
        color="neutral"
        class="relative text-white/70 hover:text-white hover:bg-white/10"
      >
        <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
      </UButton>

      <div ref="dropdownRef" class="relative">
        <UButton
          variant="ghost"
          color="neutral"
          class="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10"
          @click.stop="toggleDropdown"
        >
          <UAvatar
            :src="user?.profile?.avatar_url"
            :alt="user?.name || 'Avatar'"
            size="sm"
          />
          <span class="hidden sm:block text-sm font-medium text-white">
            {{ user?.name || user?.email }}
          </span>
          <UIcon name="i-lucide-chevron-down" class="h-4 w-4 text-white/70" />
        </UButton>

        <Transition name="dropdown">
          <div v-if="dropdownOpen" class="absolute right-0 top-full mt-2 w-56 bg-surface rounded-xl shadow-lg border border-default py-2 z-50">
            <div class="px-4 py-3 border-b border-default">
              <p class="text-sm font-medium text-highlight">{{ user?.name || "Usuário" }}</p>
              <p class="text-xs text-muted truncate">{{ user?.email }}</p>
            </div>
            <UButton
              to="/discover/settings"
              icon="i-lucide-settings"
              variant="ghost"
              color="neutral"
              class="w-full justify-start gap-3 px-4 py-2.5 text-sm text-highlight hover:bg-surface-alt"
              @click="closeDropdown"
            >
              Configurações da Conta
            </UButton>
            <UButton
              icon="i-lucide-log-out"
              variant="ghost"
              color="error"
              :loading="loggingOut"
              class="w-full justify-start gap-3 px-4 py-2.5 text-sm"
              @click="emit('logout')"
            >
              {{ loggingOut ? 'Saindo...' : 'Sair' }}
            </UButton>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dropdown-enter-active {
  transition: all 0.2s ease-out;
}
.dropdown-leave-active {
  transition: all 0.15s ease-in;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
