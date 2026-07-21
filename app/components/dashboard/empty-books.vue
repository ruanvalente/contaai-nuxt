<script setup lang="ts">
defineEmits<{
  create: []
}>()
</script>

<template>
  <div class="text-center py-12">
    <div class="mx-auto h-24 w-24 rounded-full flex items-center justify-center mb-6 bg-primary/10">
      <UIcon name="i-lucide-book-open" class="h-12 w-12 text-primary" />
    </div>
    <h3 class="text-lg font-semibold text-highlight mb-2">Nenhum livro ainda</h3>
    <p class="text-muted mb-6 max-w-sm mx-auto">
      Comece sua jornada criando seu primeiro livro. É rápido e fácil!
    </p>
    <UButton
      icon="i-lucide-plus"
      label="Criar Primeiro Livro"
      @click="$emit('create')"
    />
  </div>
</template>
