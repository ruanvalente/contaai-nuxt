import { ref, computed } from "vue";
import { useEditorStore } from "~/stores/editor-store";
import type { Version, VersionDiff, DiffSegment } from "~/types/editor";

// =============================================================================
// useVersionHistory - Version History Composable
// =============================================================================

export function useVersionHistory() {
  const store = useEditorStore();
  const versions = ref<Version[]>([]);
  const selectedVersions = ref<[string | null, string | null]>([null, null]);
  const isLoading = ref(false);

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

  // ---------------------------------------------------------------------------
  // Methods
  // ---------------------------------------------------------------------------

  async function loadVersions(chapterId: string): Promise<void> {
    isLoading.value = true;
    try {
      // TODO: Implement API call to load versions
      versions.value = [];
    } catch (err) {
      console.error("Failed to load versions:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveVersion(
    chapterId: string,
    label?: string
  ): Promise<Version | null> {
    try {
      // TODO: Implement API call to save version
      const newVersion: Version = {
        id: crypto.randomUUID(),
        chapterId,
        documentId: store.documentId || "",
        content: store.content,
        label,
        authorId: "",
        authorName: "Current User",
        createdAt: new Date(),
      };
      versions.value.push(newVersion);
      return newVersion;
    } catch (err) {
      console.error("Failed to save version:", err);
      return null;
    }
  }

  function selectVersion(versionId: string) {
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

    // TODO: Implement proper diff algorithm
    return {
      added: [],
      removed: [],
      unchanged: [],
    };
  }

  async function restoreVersion(versionId: string): Promise<boolean> {
    const version = versions.value.find((v) => v.id === versionId);
    if (!version) return false;

    try {
      store.updateContent(version.content);
      return true;
    } catch (err) {
      console.error("Failed to restore version:", err);
      return false;
    }
  }

  function getVersionById(id: string): Version | undefined {
    return versions.value.find((v) => v.id === id);
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  return {
    versions,
    sortedVersions,
    selectedVersions,
    isLoading,
    canCompare,
    canRestore,
    loadVersions,
    saveVersion,
    selectVersion,
    clearSelection,
    compareVersions,
    restoreVersion,
    getVersionById,
    formatDate,
  };
}
