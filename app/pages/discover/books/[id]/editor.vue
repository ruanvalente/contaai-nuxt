<script setup lang="ts">
import { useEditorStore } from "~/stores/editor-store";
import { useAutosave } from "~/composables/use-autosave";

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

const route = useRoute();
const store = useEditorStore();
const { setSaveHandler } = useAutosave();

const bookId = computed(() => route.params.id as string);

const isLoading = ref(true);
const error = ref<string | null>(null);

async function loadBook() {
  try {
    isLoading.value = true;
    error.value = null;
    // TODO: Fetch book document from API
    // const document = await fetchBookDocument(bookId.value);
    // store.setDocument(document);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load book";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadBook);

// Configure autosave handler
setSaveHandler(async (content) => {
  // TODO: Implement API save
  return { success: true, savedAt: new Date() };
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
        <UIcon name="i-lucide-loader-2" class="animate-spin h-8 w-8 text-muted-foreground mx-auto" />
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
    <div v-else class="editor-container">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.editor-page {
  --editor-max-width: 900px;
}

.editor-container {
  max-width: var(--editor-max-width);
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>
