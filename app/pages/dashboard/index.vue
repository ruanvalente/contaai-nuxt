<script setup lang="ts">
definePageMeta({
  title: "Dashboard",
  middleware: "auth",
  layout: "dashboard",
});

const {
  books,
  isLoading: isLoadingBooks,
  isEmpty,
  fetchBooks,
  deleteBook,
} = useUserBooks();
const { fetchMetrics } = useDashboard();
const toast = useToast();

const showCreateModal = ref(false);
const bookToDelete = ref<string | null>(null);
const showDeleteConfirm = ref(false);
const isDeleting = ref(false);

onMounted(async () => {
  await Promise.all([fetchBooks(), fetchMetrics()]);
});

function handleCreateBook() {
  showCreateModal.value = true;
}

function handleBookCreated() {
  // State already updated optimistically by createBook()
}

function handleEditBook(id: string) {
  navigateTo(`/books/${id}/edit`);
}

function handleDeleteBook(id: string) {
  bookToDelete.value = id;
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  if (!bookToDelete.value) return;

  isDeleting.value = true;
  const success = await deleteBook(bookToDelete.value);
  isDeleting.value = false;

  if (success) {
    toast.success("Livro excluído com sucesso!");
  } else {
    toast.error("Erro ao excluir livro");
  }

  showDeleteConfirm.value = false;
  bookToDelete.value = null;
}

function cancelDelete() {
  showDeleteConfirm.value = false;
  bookToDelete.value = null;
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1
        class="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-2"
      >
        Dashboard
      </h1>
      <p class="text-gray-600">
        Gerencie seus livros e acompanhe suas estatísticas
      </p>
    </div>

    <DashboardStats class="mb-8" />

    <div class="mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
      <DashboardQuickActions @create-book="handleCreateBook" />
    </div>

    <div class="mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Meus Livros</h2>
        <button
          v-if="!isEmpty"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-600 hover:text-accent-700 hover:bg-accent-50 rounded-lg transition-colors"
          @click="handleCreateBook"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Novo Livro
        </button>
      </div>

      <DashboardBookGrid
        v-if="!isEmpty || isLoadingBooks"
        :books="[...books]"
        :is-loading="isLoadingBooks"
        @edit="handleEditBook"
        @delete="handleDeleteBook"
      />

      <DashboardEmptyBooks v-else @create="handleCreateBook" />
    </div>

    <DashboardCreateBookModal
      :open="showCreateModal"
      @close="showCreateModal = false"
      @created="handleBookCreated"
    />

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="absolute inset-0 bg-black/50" @click="cancelDelete" />

          <div
            class="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
          >
            <div class="flex items-center gap-4 mb-4">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Excluir livro
                </h3>
                <p class="text-sm text-gray-500">
                  Tem certeza que deseja excluir este livro? Esta ação não pode
                  ser desfeita.
                </p>
              </div>
            </div>

            <div class="flex gap-3 justify-end">
              <button
                :disabled="isDeleting"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                @click="cancelDelete"
              >
                Cancelar
              </button>
              <button
                :disabled="isDeleting"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                @click="confirmDelete"
              >
                <span v-if="isDeleting" class="flex items-center gap-2">
                  <svg
                    class="animate-spin h-4 w-4"
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
                  Excluindo...
                </span>
                <span v-else>Excluir</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
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
