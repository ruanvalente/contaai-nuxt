import { ref, computed } from "vue";
import { useEditorStore } from "~/stores/editor-store";
import type {
  ExportFormat,
  ExportOptions,
  ExportResult,
  DEFAULT_EXPORT_OPTIONS,
} from "~/types/editor";

// =============================================================================
// useExport - Export Composable
// =============================================================================

export function useExport() {
  const store = useEditorStore();
  const isExporting = ref(false);
  const exportProgress = ref(0);
  const lastExportResult = ref<ExportResult | null>(null);

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  const isExportDisabled = computed(
    () => isExporting.value || !store.document
  );

  // ---------------------------------------------------------------------------
  // Export Methods
  // ---------------------------------------------------------------------------

  async function exportToMarkdown(options?: Partial<ExportOptions>): Promise<ExportResult> {
    isExporting.value = true;
    exportProgress.value = 0;

    try {
      // TODO: Implement JSON to Markdown conversion
      const markdown = convertContentToMarkdown(store.content);

      const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
      const filename = `${store.document?.title || "documento"}.md`;

      const result: ExportResult = {
        success: true,
        blob,
        filename,
      };

      lastExportResult.value = result;
      exportProgress.value = 100;
      return result;
    } catch (err) {
      const result: ExportResult = {
        success: false,
        error: err instanceof Error ? err.message : "Export failed",
      };
      lastExportResult.value = result;
      return result;
    } finally {
      isExporting.value = false;
    }
  }

  async function exportToPDF(options?: Partial<ExportOptions>): Promise<ExportResult> {
    isExporting.value = true;
    exportProgress.value = 0;

    try {
      // TODO: Implement JSON to PDF conversion
      // Flow: JSON -> HTML -> PDF
      const html = convertContentToHTML(store.content);

      const result: ExportResult = {
        success: true,
        filename: `${store.document?.title || "documento"}.pdf`,
      };

      lastExportResult.value = result;
      exportProgress.value = 100;
      return result;
    } catch (err) {
      const result: ExportResult = {
        success: false,
        error: err instanceof Error ? err.message : "PDF export failed",
      };
      lastExportResult.value = result;
      return result;
    } finally {
      isExporting.value = false;
    }
  }

  async function exportToHTML(options?: Partial<ExportOptions>): Promise<ExportResult> {
    isExporting.value = true;
    exportProgress.value = 0;

    try {
      const html = convertContentToHTML(store.content);

      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const filename = `${store.document?.title || "documento"}.html`;

      const result: ExportResult = {
        success: true,
        blob,
        filename,
      };

      lastExportResult.value = result;
      exportProgress.value = 100;
      return result;
    } catch (err) {
      const result: ExportResult = {
        success: false,
        error: err instanceof Error ? err.message : "HTML export failed",
      };
      lastExportResult.value = result;
      return result;
    } finally {
      isExporting.value = false;
    }
  }

  async function exportToTXT(options?: Partial<ExportOptions>): Promise<ExportResult> {
    isExporting.value = true;
    exportProgress.value = 0;

    try {
      const text = convertContentToText(store.content);

      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const filename = `${store.document?.title || "documento"}.txt`;

      const result: ExportResult = {
        success: true,
        blob,
        filename,
      };

      lastExportResult.value = result;
      exportProgress.value = 100;
      return result;
    } catch (err) {
      const result: ExportResult = {
        success: false,
        error: err instanceof Error ? err.message : "TXT export failed",
      };
      lastExportResult.value = result;
      return result;
    } finally {
      isExporting.value = false;
    }
  }

  // ---------------------------------------------------------------------------
  // Conversion Helpers (Stub implementations - to be enhanced)
  // ---------------------------------------------------------------------------

  function convertContentToMarkdown(content: any): string {
    // TODO: Implement full conversion
    return JSON.stringify(content, null, 2);
  }

  function convertContentToHTML(content: any): string {
    // TODO: Implement full conversion
    return `<div>${JSON.stringify(content)}</div>`;
  }

  function convertContentToText(content: any): string {
    // TODO: Implement full conversion
    return JSON.stringify(content, null, 2);
  }

  // ---------------------------------------------------------------------------
  // Download Helper
  // ---------------------------------------------------------------------------

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function exportAndDownload(
    format: ExportFormat,
    options?: Partial<ExportOptions>
  ): Promise<void> {
    let result: ExportResult;

    switch (format) {
      case "markdown":
        result = await exportToMarkdown(options);
        break;
      case "pdf":
        result = await exportToPDF(options);
        break;
      case "html":
        result = await exportToHTML(options);
        break;
      case "txt":
        result = await exportToTXT(options);
        break;
      default:
        result = { success: false, error: `Unsupported format: ${format}` };
    }

    if (result.success && result.blob && result.filename) {
      downloadBlob(result.blob, result.filename);
    }
  }

  return {
    isExporting,
    exportProgress,
    lastExportResult,
    isExportDisabled,
    exportToMarkdown,
    exportToPDF,
    exportToHTML,
    exportToTXT,
    exportAndDownload,
    downloadBlob,
  };
}
