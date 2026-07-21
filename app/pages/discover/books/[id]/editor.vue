<script setup lang="ts">
import { useEditorStore } from "~/stores/editor-store";
import { useAutosave } from "~/composables/use-autosave";
import type { BookDocument, Chapter, EditorContent } from "~/types/editor";

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

const route = useRoute();
const store = useEditorStore();
const { setSaveHandler, saveNow } = useAutosave();

const bookId = computed(() => route.params.id as string);

const isLoading = ref(true);
const error = ref<string | null>(null);

const chapterOptions = computed(() =>
  (store.document?.chapters ?? []).map((ch) => ({
    label: ch.title,
    value: ch.id,
  }))
);

const selectedChapterId = computed({
  get: () => store.activeChapter?.id ?? null,
  set: async (id: string | null) => {
    if (!id) return
    const chapter = (store.document?.chapters ?? []).find((ch) => ch.id === id)
    if (!chapter) return
    const isEmpty =
      !chapter.content ||
      (chapter.content.content?.length === 1 &&
        chapter.content.content[0]?.type === "paragraph" &&
        !(chapter.content.content[0] as any).content?.length)
    if (isEmpty) {
      await store.loadChapterContent(chapter.id)
    } else {
      store.setActiveChapter(chapter)
    }
  },
})

async function loadBook() {
  try {
    isLoading.value = true;
    error.value = null;

    // Fetch book document from API
    const bookData = await $fetch(`/api/books/${bookId.value}`);

    // Fetch chapters for this book
    const chaptersData = await $fetch("/api/editor/chapters", {
      params: { documentId: bookId.value },
    });

    // Map chapters to our type
    const chapters: Chapter[] = (chaptersData as any[]).map((ch) => ({
      id: ch.id,
      documentId: ch.document_id,
      title: ch.title,
      content: ch.content || { type: "doc", content: [{ type: "paragraph", content: [] }] },
      order: ch.order,
      createdAt: new Date(ch.created_at),
      updatedAt: new Date(ch.updated_at),
    }));

    // Create document object
    const document: BookDocument = {
      id: bookId.value,
      title: (bookData as any).title,
      author: (bookData as any).author || "",
      description: (bookData as any).description,
      coverUrl: (bookData as any).cover_url,
      category: (bookData as any).category,
      chapters,
      createdAt: new Date((bookData as any).created_at),
      updatedAt: new Date(),
      authorId: "",
    };

    store.setDocument(document);

    if (chapters.length > 0 && chapters[0]) {
      await store.loadChapterContent(chapters[0].id);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load book";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadBook);

// Configure autosave handler
setSaveHandler(async (content: EditorContent) => {
  const chapterId = store.chapterId;

  if (!chapterId) {
    return { success: false, error: "Nenhum capítulo selecionado" };
  }

  try {
    await $fetch(`/api/editor/chapter/${chapterId}`, {
      method: "PUT",
      body: {
        content,
        wordCount: store.stats.words,
      },
    });

    return { success: true, savedAt: new Date() };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro ao salvar",
    };
  }
});

// Handle manual save with keyboard shortcut
function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === "s") {
    e.preventDefault();
    saveNow();
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("keydown", handleKeydown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("keydown", handleKeydown);
  }
});

useHead({
  title: computed(() => `${store.document?.title || "Editor"} - ContaAI`),
});
</script>

<template>
  <div class="editor-page min-h-screen bg-background">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex items-center justify-center min-h-[60vh]"
    >
      <div class="text-center">
        <UIcon
          name="i-lucide-loader-2"
          class="animate-spin h-8 w-8 text-muted-foreground mx-auto"
        />
        <p class="mt-4 text-muted-foreground">Carregando editor...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex items-center justify-center min-h-[60vh]"
    >
      <UAlert
        color="error"
        variant="subtle"
        title="Erro ao carregar"
        :description="error"
      >
        <template #actions>
          <UButton
            label="Tentar novamente"
            color="error"
            variant="outline"
            @click="loadBook"
          />
        </template>
      </UAlert>
    </div>

    <!-- Editor Content -->
    <div v-else class="flex h-[calc(100vh-4rem)]">
      <!-- Chapter Sidebar -->
      <div class="w-72 border-r border-default shrink-0 overflow-hidden hidden md:block">
        <EditorChapterList />
      </div>

      <!-- Editor Area -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Mobile chapter selector -->
        <div class="md:hidden px-4 py-2 border-b border-default">
          <USelect
            :items="chapterOptions"
            :model-value="selectedChapterId ?? undefined"
            class="w-full"
            @update:model-value="(id: any) => selectedChapterId = id"
          />
        </div>

        <EditorBookEditor
          placeholder="Comece a escrever seu livro..."
        />
      </div>
    </div>
  </div>
</template>
