<script setup lang="ts">
import type { AuthUser } from '~/types/auth';

interface Props {
  user: AuthUser | null;
}

defineProps<Props>();

const emit = defineEmits<{
  toggleSidebar: [];
}>();
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6"
  >
    <button
      class="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <NuxtLink to="/dashboard" class="hidden lg:flex items-center gap-2 ml-2">
      <div class="h-8 w-8 rounded-lg bg-accent-500 flex items-center justify-center">
        <span class="text-white font-display font-bold text-sm">C</span>
      </div>
      <span class="font-display font-semibold text-lg text-gray-900">ContaAI</span>
    </NuxtLink>

    <div class="flex-1" />

    <div class="flex items-center gap-3">
      <button
        class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
          class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-500"
        />
      </button>

      <div class="flex items-center gap-2">
        <div
          class="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="user?.profile?.avatar_url"
            :src="user.profile.avatar_url"
            :alt="user.name || 'Avatar'"
            class="h-full w-full object-cover"
          />
          <span v-else class="text-accent-600 font-medium text-sm">
            {{ (user?.name || user?.email || 'U').charAt(0).toUpperCase() }}
          </span>
        </div>
        <span class="hidden sm:block text-sm font-medium text-gray-700">
          {{ user?.name || user?.email }}
        </span>
      </div>
    </div>
  </header>
</template>
