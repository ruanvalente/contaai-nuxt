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
  <header
    class="fixed top-0 left-0 right-0 z-40 h-16 bg-sidebar flex items-center px-4 sm:px-6"
  >
    <button
      class="lg:hidden p-2 -ml-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      @click="emit('toggleSidebar')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <NuxtLink to="/discover" class="hidden lg:flex items-center gap-2 ml-2">
      <div
        class="h-8 w-8 rounded-lg bg-accent flex items-center justify-center"
      >
        <span class="text-white font-display font-bold text-sm">C</span>
      </div>
      <span class="font-display font-semibold text-lg text-white">ContaAI</span>
    </NuxtLink>

    <div class="flex-1" />

    <div class="flex items-center gap-3">
      <button
        class="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span
          class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent"
        />
      </button>

      <div ref="dropdownRef" class="relative">
        <button
          class="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
          @click.stop="toggleDropdown"
        >
          <div
            class="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="user?.profile?.avatar_url"
              :src="user.profile.avatar_url"
              :alt="user.name || 'Avatar'"
              class="h-full w-full object-cover"
            />
            <span v-else class="text-white font-medium text-sm">
              {{ (user?.name || user?.email || "U").charAt(0).toUpperCase() }}
            </span>
          </div>
          <span class="hidden sm:block text-sm font-medium text-white">
            {{ user?.name || user?.email }}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-white/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <Transition name="dropdown">
          <div
            v-if="dropdownOpen"
            class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
          >
            <div class="px-4 py-3 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-900">
                {{ user?.name || "Usuário" }}
              </p>
              <p class="text-xs text-gray-500 truncate">
                {{ user?.email }}
              </p>
            </div>
            <NuxtLink
              to="/discover/settings"
              class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              @click="closeDropdown"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Configurações da Conta
            </NuxtLink>
            <button
              :disabled="loggingOut"
              class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors disabled:opacity-50"
              @click="emit('logout')"
            >
              <svg
                v-if="loggingOut"
                class="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {{ loggingOut ? 'Saindo...' : 'Sair' }}
            </button>
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
