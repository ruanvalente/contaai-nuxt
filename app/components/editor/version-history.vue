<script setup lang="ts">
import { useEditorStore } from "~/stores/editor-store";
import { useVersionHistory } from "~/composables/use-version-history";
import type { Version, DiffSegment } from "~/types/editor";

const store = useEditorStore();
const {
  sortedVersions,
  selectedVersions,
  selectedVersionA,
  selectedVersionB,
  isLoading,
  isRestoring,
  error,
  canCompare,
  canRestore,
  loadVersions,
  saveVersion,
  restoreVersion,
  selectVersion,
  clearSelection,
  compareVersions,
  formatDate,
  formatRelativeTime,
  getTextPreview,
} = useVersionHistory();

const emit = defineEmits<{
  close: [];
}>();

const showDiff = ref(false);
const isSaving = ref(false);
const showLabelInput = ref(false);
const newLabel = ref("");
const restoreConfirmId = ref<string | null>(null);

const diff = computed(() => {
  if (!showDiff.value || !canCompare.value) return null;
  return compareVersions();
});

async function loadIfEmpty() {
  const chapterId = store.chapterId;
  if (chapterId && sortedVersions.value.length === 0 && !isLoading.value) {
    await loadVersions(chapterId);
  }
}

async function handleSaveVersion() {
  const chapterId = store.chapterId;
  if (!chapterId) return;

  isSaving.value = true;
  try {
    await saveVersion(chapterId, newLabel.value.trim() || undefined);
    newLabel.value = "";
    showLabelInput.value = false;
  } finally {
    isSaving.value = false;
  }
}

async function handleRestore(versionId: string) {
  const success = await restoreVersion(versionId);
  if (success) {
    restoreConfirmId.value = null;
    showDiff.value = false;
    clearSelection();
  }
}

function toggleDiff() {
  showDiff.value = !showDiff.value;
}

onMounted(loadIfEmpty);

watch(() => store.chapterId, () => {
  showDiff.value = false;
  clearSelection();
  loadIfEmpty();
});
</script>

<template>
  <div class="version-history flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-default">
      <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Histórico
      </h3>
      <UButton
        icon="i-lucide-x"
        size="xs"
        color="neutral"
        variant="ghost"
        @click="emit('close')"
      />
    </div>

    <!-- Actions Bar -->
    <div class="px-4 py-3 border-b border-default space-y-2">
      <!-- Save new version -->
      <div v-if="!showLabelInput" class="flex gap-2">
        <UButton
          icon="i-lucide-save"
          size="sm"
          color="primary"
          variant="soft"
          :loading="isSaving"
          label="Salvar versão"
          class="flex-1"
          @click="showLabelInput = true"
        />
      </div>
      <div v-else class="space-y-2">
        <UInput
          v-model="newLabel"
          placeholder="Rótulo (opcional)"
          size="sm"
          autofocus
          @keydown.enter="handleSaveVersion"
          @keydown.escape="showLabelInput = false"
        />
        <div class="flex gap-2">
          <UButton
            size="xs"
            color="primary"
            label="Salvar"
            :loading="isSaving"
            @click="handleSaveVersion"
          />
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="showLabelInput = false"
          />
        </div>
      </div>

      <!-- Compare / Restore actions -->
      <div v-if="selectedVersions[0] !== null" class="flex gap-2">
        <UButton
          v-if="canCompare"
          size="xs"
          :color="showDiff ? 'primary' : 'neutral'"
          :variant="showDiff ? 'soft' : 'outline'"
          icon="i-lucide-git-compare"
          :label="showDiff ? 'Ocultar diff' : 'Comparar'"
          @click="toggleDiff"
        />
        <UButton
          size="xs"
          color="warning"
          variant="soft"
          icon="i-lucide-undo-2"
          label="Restaurar"
          :loading="isRestoring"
          @click="restoreConfirmId = selectedVersions[0]"
        />
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="clearSelection"
        />
      </div>
    </div>

    <!-- Error -->
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :description="error"
      class="mx-4 mt-3"
    />

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="animate-spin h-6 w-6 text-muted-foreground" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="sortedVersions.length === 0"
      class="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <UIcon name="i-lucide-history" class="h-10 w-10 text-muted-foreground/50 mb-3" />
      <p class="text-sm text-muted-foreground">
        Nenhuma versão salva ainda
      </p>
      <p class="text-xs text-muted-foreground/70 mt-1">
        Salve uma versão para começar o histórico
      </p>
    </div>

    <!-- Diff View -->
    <div v-else-if="showDiff && diff" class="border-b border-default">
      <div class="px-4 py-3">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xs font-medium text-muted-foreground">Comparação:</span>
          <span v-if="selectedVersionA" class="text-xs truncate max-w-[100px]">
            {{ formatDate(selectedVersionA.createdAt) }}
          </span>
          <UIcon name="i-lucide-arrow-right" class="h-3 w-3 text-muted-foreground shrink-0" />
          <span v-if="selectedVersionB" class="text-xs truncate max-w-[100px]">
            {{ formatDate(selectedVersionB.createdAt) }}
          </span>
        </div>

        <div class="max-h-60 overflow-y-auto text-sm leading-relaxed space-y-1">
          <template v-if="diff.removed.length > 0 || diff.added.length > 0 || diff.unchanged.length > 0">
            <template v-for="(seg, idx) in diff.unchanged" :key="'u-' + idx">
              <span class="text-muted-foreground">{{ seg.content }}</span>
              <span> </span>
            </template>
            <template v-for="(seg, idx) in diff.removed" :key="'r-' + idx">
              <span class="bg-error/15 text-error line-through">{{ seg.content }}</span>
              <span> </span>
            </template>
            <template v-for="(seg, idx) in diff.added" :key="'a-' + idx">
              <span class="bg-success/15 text-success font-medium">{{ seg.content }}</span>
              <span> </span>
            </template>
          </template>
          <p v-else class="text-xs text-muted-foreground italic">
            Nenhuma diferença encontrada
          </p>
        </div>
      </div>
    </div>

    <!-- Versions List -->
    <div class="flex-1 overflow-y-auto">
      <ul class="divide-y divide-default">
        <li
          v-for="version in sortedVersions"
          :key="version.id"
          class="group"
        >
          <button
            class="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors"
            :class="{
              'bg-primary/5 border-l-2 border-primary': selectedVersions.includes(version.id),
            }"
            @click="selectVersion(version.id)"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium text-foreground">
                    {{ version.label || `Versão` }}
                  </span>
                  <span
                    v-if="selectedVersions.indexOf(version.id) === 0"
                    class="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium"
                  >
                    A
                  </span>
                  <span
                    v-else-if="selectedVersions.indexOf(version.id) === 1"
                    class="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium"
                  >
                    B
                  </span>
                </div>
                <p class="text-xs text-muted-foreground mt-0.5">
                  {{ formatRelativeTime(version.createdAt) }}
                </p>
                <p class="text-xs text-muted-foreground/70 mt-0.5">
                  {{ version.authorName }} · {{ version.wordCount || 0 }} palavras
                </p>
                <p class="text-xs text-muted-foreground/50 mt-1 line-clamp-2">
                  {{ getTextPreview(version.content) }}
                </p>
              </div>

              <div class="hidden group-hover:flex items-center gap-0.5 shrink-0">
                <UTooltip text="Restaurar esta versão">
                  <UButton
                    icon="i-lucide-undo-2"
                    size="xs"
                    color="warning"
                    variant="ghost"
                    :loading="isRestoring && restoreConfirmId === version.id"
                    @click.stop="restoreConfirmId = version.id"
                  />
                </UTooltip>
              </div>
            </div>
          </button>

          <!-- Restore Confirmation -->
          <div
            v-if="restoreConfirmId === version.id"
            class="px-4 py-2 bg-warning/5 border-t border-warning/20"
          >
            <p class="text-xs text-muted-foreground mb-2">
              Restaurar esta versão? O conteúdo atual será substituído.
            </p>
            <div class="flex gap-2">
              <UButton
                size="xs"
                color="warning"
                label="Confirmar"
                :loading="isRestoring"
                @click="handleRestore(version.id)"
              />
              <UButton
                size="xs"
                color="neutral"
                variant="ghost"
                label="Cancelar"
                @click="restoreConfirmId = null"
              />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
