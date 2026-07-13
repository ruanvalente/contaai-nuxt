<script setup lang="ts">
defineEmits<{
  create: []
}>()
</script>

<template>
  <div class="text-center py-12">
    <div class="mx-auto h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Nenhum livro ainda</h3>
    <p class="text-gray-500 mb-6 max-w-sm mx-auto">
      Comece sua jornada criando seu primeiro livro. É rápido e fácil!
    </p>
    <button
      class="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors"
      @click="$emit('create')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Criar Primeiro Livro
    </button>
  </div>
</template>
