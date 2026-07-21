import { ref, computed } from "vue";
import { useEditorStore } from "~/stores/editor-store";
import type { Version, VersionDiff, DiffSegment, EditorContent } from "~/types/editor";
import { computeDiff, extractPlainText } from "~/utils/editor/diff-utils";

// =============================================================================
// useVersionHistory - Version History Composable
// =============================================================================

export function useVersionHistory() {
  const store = useEditorStore();
  const versions = ref<Version[]>([]);
  const selectedVersions = ref<[string | null, string | null]>([null, null]);
  const isLoading = ref(false);
  const isRestoring = ref(false);
  const error = ref<string | null>(null);

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  const sortedVersions = computed(() =>
    [...versions.value].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  const canCompare = computed(
    () => selectedVersions.value[0] !== null && selectedVersions.value[1] !== null
  );

  const canRestore = computed(() => selectedVersions.value[0] !== null);

  const selectedVersionA = computed(() =>
    selectedVersions.value[0]
      ? versions.value.find((v) => v.id === selectedVersions.value[0]) ?? null
      : null
  );

  const selectedVersionB = computed(() =>
    selectedVersions.value[1]
      ? versions.value.find((v) => v.id === selectedVersions.value[1]) ?? null
      : null
  );

  // ---------------------------------------------------------------------------
  // API Methods
  // ---------------------------------------------------------------------------

  async function loadVersions(chapterId: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await $fetch<any[]>(`/api/editor/chapter/${chapterId}/versions`);
      versions.value = data.map((v) => ({
        ...v,
        createdAt: new Date(v.createdAt),
      }));
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao carregar versões";
      console.error("Failed to load versions:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveVersion(
    chapterId: string,
    label?: string
  ): Promise<Version | null> {
    error.value = null;
    try {
      const data = await $fetch<any>(`/api/editor/chapter/${chapterId}/versions`, {
        method: "POST",
        body: {
          content: store.content,
          label: label || null,
          wordCount: store.stats.words,
        },
      });

      const newVersion: Version = {
        id: data.id,
        chapterId: data.chapterId,
        documentId: data.documentId,
        content: data.content,
        label: data.label,
        wordCount: data.wordCount,
        authorId: data.authorId,
        authorName: data.authorName,
        createdAt: new Date(data.createdAt),
      };

      versions.value.unshift(newVersion);

      // Server may have pruned oldest versions — reload to stay in sync
      if (versions.value.length > 50) {
        await loadVersions(chapterId);
      }

      return newVersion;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao salvar versão";
      console.error("Failed to save version:", err);
      return null;
    }
  }

  async function restoreVersion(versionId: string): Promise<boolean> {
    isRestoring.value = true;
    error.value = null;
    try {
      const data = await $fetch<any>(`/api/editor/version/${versionId}/restore`, {
        method: "POST",
      });

      if (data.success && data.content) {
        const restoredContent = data.content as EditorContent;

        // Update store content
        store.updateContent(restoredContent);

        // Update activeChapter so switching away and back preserves the restore
        if (store.activeChapter) {
          store.activeChapter = { ...store.activeChapter, content: restoredContent };
        }

        // Update the chapter in the document's chapters array
        if (store.document && data.chapterId) {
          const index = store.document.chapters.findIndex((ch) => ch.id === data.chapterId);
          if (index !== -1) {
            const updated = [...store.document.chapters];
            updated[index] = { ...updated[index]!, content: restoredContent };
            store.document = { ...store.document, chapters: updated };
          }
        }

        // Recalculate stats
        const { calculateStats } = await import("~/utils/editor/editor-utils");
        store.setStats(calculateStats(restoredContent));

        return true;
      }

      return false;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao restaurar versão";
      console.error("Failed to restore version:", err);
      return false;
    } finally {
      isRestoring.value = false;
    }
  }

  // ---------------------------------------------------------------------------
  // Selection & Comparison
  // ---------------------------------------------------------------------------

  function selectVersion(versionId: string) {
    if (selectedVersions.value[0] === versionId) {
      selectedVersions.value[0] = selectedVersions.value[1];
      selectedVersions.value[1] = null;
      return;
    }
    if (selectedVersions.value[1] === versionId) {
      selectedVersions.value[1] = null;
      return;
    }
    if (selectedVersions.value[0] === null) {
      selectedVersions.value[0] = versionId;
    } else if (selectedVersions.value[1] === null) {
      selectedVersions.value[1] = versionId;
    } else {
      selectedVersions.value = [versionId, null];
    }
  }

  function clearSelection() {
    selectedVersions.value = [null, null];
  }

  function compareVersions(): VersionDiff {
    if (!canCompare.value) {
      return { added: [], removed: [], unchanged: [] };
    }

    const v1 = versions.value.find((v) => v.id === selectedVersions.value[0]);
    const v2 = versions.value.find((v) => v.id === selectedVersions.value[1]);

    if (!v1 || !v2) {
      return { added: [], removed: [], unchanged: [] };
    }

    // v1 is the older version, v2 is the newer
    const older = new Date(v1.createdAt) < new Date(v2.createdAt) ? v1 : v2;
    const newer = older === v1 ? v2 : v1;

    return computeDiff(older.content, newer.content);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function getVersionById(id: string): Version | undefined {
    return versions.value.find((v) => v.id === id);
  }

  function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();

    // Handle future dates (clock skew) by showing absolute date
    if (diffMs < 0) return formatDate(date);

    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "Agora";
    if (diffMin < 60) return `${diffMin} min atrás`;
    if (diffHrs < 24) return `${diffHrs}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return formatDate(date);
  }

  function getTextPreview(content: EditorContent): string {
    const text = extractPlainText(content);
    return text.length > 120 ? text.slice(0, 120) + "..." : text;
  }

  return {
    versions,
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
    getVersionById,
    formatDate,
    formatRelativeTime,
    getTextPreview,
  };
}
