<script setup lang="ts">
definePageMeta({
  title: "Discover",
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
  navigateTo(`/discover/books/${id}/editor`);
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
      <h1 class="text-2xl md:text-3xl font-display font-semibold text-highlight mb-2">
        Discover
      </h1>
      <p class="text-muted">
        Gerencie seus livros e acompanhe suas estatísticas
      </p>
    </div>

    <DashboardStats class="mb-8" />

    <div class="mb-6">
      <h2 class="text-lg font-semibold text-highlight mb-4">Ações Rápidas</h2>
      <DashboardQuickActions @create-book="handleCreateBook" />
    </div>

    <div class="mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-highlight">Meus Livros</h2>
        <UButton
          v-if="!isEmpty"
          icon="i-lucide-plus"
          label="Novo Livro"
          color="primary"
          variant="ghost"
          @click="handleCreateBook"
        />
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

    <UModal v-model:open="showDeleteConfirm" :ui="{ content: 'max-w-sm' }">
      <template #header>
        <div class="flex items-center gap-4">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
            <UIcon name="i-lucide-alert-triangle" class="h-5 w-5 text-error" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-highlight">Excluir livro</h3>
            <p class="text-sm text-muted">
              Tem certeza que deseja excluir este livro? Esta ação não pode
              ser desfeita.
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <UButton
            label="Cancelar"
            color="neutral"
            variant="outline"
            :disabled="isDeleting"
            @click="cancelDelete"
          />
          <UButton
            label="Excluir"
            color="error"
            :loading="isDeleting"
            @click="confirmDelete"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
