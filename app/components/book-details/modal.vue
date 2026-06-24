<script setup lang="ts">
import type { Book } from '~/types/book.entity'

interface Props {
  book: Book | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="book"
      class="xl:hidden fixed inset-0 z-50 bg-black/50"
      @click="emit('close')"
    >
      <Transition name="modal-slide">
        <div
          class="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto bg-primary-100 rounded-t-3xl"
          @click.stop
        >
          <div class="sticky top-0 bg-primary-100 pt-3 pb-2 px-4 border-b border-primary-300 z-10">
            <div class="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-gray-900">
                Detalhes do Livro
              </h3>
              <button
                @click="emit('close')"
                class="p-2 rounded-full hover:bg-primary-200 transition-colors"
                aria-label="Fechar"
              >
                <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-4 pb-8">
            <BookDetailsPanel :book="book" />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <Transition name="panel-slide">
    <div
      v-if="book"
      class="hidden xl:block fixed top-18.25 right-0 bottom-0 w-96 z-40 bg-primary-100 border-l border-primary-300 shadow-xl overflow-y-auto"
    >
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-900">
            Detalhes do Livro
          </h3>
          <button
            @click="emit('close')"
            class="p-2 rounded-full hover:bg-primary-200 transition-colors"
            aria-label="Fechar"
          >
            <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <BookDetailsPanel :book="book" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}
.modal-slide-enter-from,
.modal-slide-leave-to {
  transform: translateY(100%);
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s ease;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
