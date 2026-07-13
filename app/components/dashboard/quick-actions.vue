<script setup lang="ts">
const emit = defineEmits<{
  createBook: []
}>()

const handleAction = (action: { action?: string; to?: string }) => {
  if (action.action === 'createBook') {
    emit('createBook')
  } else if (action.to) {
    navigateTo(action.to)
  }
}

const actions = [
  {
    label: 'Novo Livro',
    icon: 'plus',
    color: 'bg-accent-500',
    action: 'createBook',
  },
  {
    label: 'Explorar',
    icon: 'search',
    color: 'bg-blue-500',
    to: '/explore',
  },
  {
    label: 'Minha Sessão',
    icon: 'book',
    color: 'bg-green-500',
    to: '/my-session',
  },
  {
    label: 'Estatísticas',
    icon: 'chart',
    color: 'bg-purple-500',
    disabled: true,
  },
]
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <button
      v-for="action in actions"
      :key="action.label"
      :disabled="action.disabled"
      :class="[
        'flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all',
        action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md',
      ]"
      @click="handleAction(action)"
    >
      <div :class="[action.color, 'w-12 h-12 rounded-full flex items-center justify-center text-white']">
        <svg v-if="action.icon === 'plus'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <svg v-else-if="action.icon === 'search'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <svg v-else-if="action.icon === 'book'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <svg v-else-if="action.icon === 'chart'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <span class="text-sm font-medium text-gray-700">{{ action.label }}</span>
    </button>
  </div>
</template>
