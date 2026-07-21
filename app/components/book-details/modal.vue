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
          class="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto bg-surface rounded-t-3xl"
          @click.stop
        >
          <div class="sticky top-0 bg-surface pt-3 pb-2 px-4 border-b border-default z-10">
            <div class="w-12 h-1 bg-muted rounded-full mx-auto mb-3" />
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-highlight">
                Detalhes do Livro
              </h3>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="emit('close')"
              />
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
      class="hidden xl:block fixed top-18.25 right-0 bottom-0 w-96 z-40 bg-surface border-l border-default shadow-xl overflow-y-auto"
    >
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-highlight">
            Detalhes do Livro
          </h3>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="emit('close')"
          />
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
