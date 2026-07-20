<script setup lang="ts">
import type { CreateBookPayload } from "~/types/dashboard";
import { BOOK_CATEGORY_OPTIONS } from "~/types/dashboard";

interface Props {
  open: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const { createBook, updateBook, isCreating } = useUserBooks();
const toast = useToast();

const form = reactive<CreateBookPayload>({
  title: "",
  author: "",
  category: "",
  coverColor: "#8B4513",
  coverUrl: undefined,
});

const coverPreview = ref<string | null>(null);
const coverFile = ref<File | null>(null);

const handleSubmit = async () => {
  if (!form.title.trim()) {
    toast.error("Título é obrigatório");
    return;
  }
  if (!form.author.trim()) {
    toast.error("Autor é obrigatório");
    return;
  }
  if (!form.category) {
    toast.error("Selecione uma categoria");
    return;
  }

  const book = await createBook(form);

  if (book && coverFile.value) {
    try {
      const formData = new FormData();
      formData.append("bookId", book.id);
      formData.append("file", coverFile.value);

      const { url } = await $fetch<{ url: string }>("/api/user/books/cover", {
        method: "POST",
        body: formData,
      });

      updateBook(book.id, { cover_url: url });
    } catch (e) {
      console.error("Erro ao fazer upload da capa:", e);
      toast.info(
        "Livro criado, mas houve erro ao enviar a capa. Você pode editá-lo depois.",
      );
    }
  }

  if (book) {
    toast.success("Livro criado com sucesso!");
    resetForm();
    emit("created");
    emit("close");
  } else {
    toast.error("Erro ao criar livro");
  }
};

const handleCoverUpload = (file: File) => {
  coverFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    coverPreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const handleCoverRemove = () => {
  coverPreview.value = null;
  coverFile.value = null;
  form.coverUrl = undefined;
};

const resetForm = () => {
  form.title = "";
  form.author = "";
  form.category = "";
  form.coverColor = "#8B4513";
  form.coverUrl = undefined;
  coverPreview.value = null;
  coverFile.value = null;
};

const handleClose = () => {
  resetForm();
  emit("close");
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/50" @click="handleClose" />

        <div
          class="relative bg-surface rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div
            class="sticky top-0 bg-surface border-b border-default px-6 py-4 flex items-center justify-between"
          >
            <h2 class="text-lg font-semibold text-highlight">Novo Livro</h2>
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="neutral"
              size="sm"
              @click="handleClose"
            />
          </div>

          <form class="p-6 space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label class="block text-sm font-medium text-muted mb-2"
                >Capa</label
              >
              <DashboardUploadCover
                :preview="coverPreview"
                @upload="handleCoverUpload"
                @remove="handleCoverRemove"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-muted mb-2"
                >Cor da Capa</label
              >
              <DashboardCoverColorPicker v-model="form.coverColor" />
            </div>

            <div>
              <label class="block text-sm font-medium text-muted mb-2"
                >Título *</label
              >
              <UInput
                v-model="form.title"
                placeholder="Nome do livro"
                class="w-full"
                variant="outline"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-muted mb-2"
                >Autor *</label
              >
              <UInput
                class="w-full"
                v-model="form.author"
                placeholder="Nome do autor"
                variant="outline"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-muted mb-2"
                >Categoria *</label
              >
              <DashboardCategorySelect
                v-model="form.category"
                :items="BOOK_CATEGORY_OPTIONS"
              />
            </div>

            <div class="flex gap-3 pt-4 justify-end border-t border-default">
              <UButton
                type="button"
                label="Cancelar"
                variant="outline"
                class="py-4 text-center"
                @click="handleClose"
              />
              <UButton
                type="submit"
                label="Criar Livro"
                variant="solid"
                :loading="isCreating"
                class="px-4 py-4 text-center"
              />
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
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
