<script setup lang="ts">
import { useEditorStore } from "~/stores/editor-store";

const store = useEditorStore();

const statusConfig = computed(() => {
  switch (store.saveStatus) {
    case "saving":
      return {
        icon: "i-lucide-loader-2",
        text: "Salvando...",
        class: "text-warning",
        animate: true,
      };
    case "saved":
      return {
        icon: "i-lucide-check-circle",
        text: "Salvo",
        class: "text-success",
        animate: false,
      };
    case "error":
      return {
        icon: "i-lucide-alert-circle",
        text: "Erro ao salvar",
        class: "text-error",
        animate: false,
      };
    default:
      return {
        icon: "i-lucide-circle",
        text: "",
        class: "text-muted",
        animate: false,
      };
  }
});

const lastSavedText = computed(() => {
  if (!store.lastSavedAt) return "";
  const now = new Date();
  const diff = now.getTime() - new Date(store.lastSavedAt).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Agora";
  if (minutes === 1) return "1 min atrás";
  if (minutes < 60) return `${minutes} min atrás`;
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(store.lastSavedAt);
});
</script>

<template>
  <span
    class="save-status flex items-center gap-1"
    :class="statusConfig.class"
  >
    <UIcon
      :name="statusConfig.icon"
      class="h-3 w-3"
      :class="{ 'animate-spin': statusConfig.animate }"
    />
    <span v-if="statusConfig.text">{{ statusConfig.text }}</span>
    <span v-if="lastSavedText && store.saveStatus === 'saved'" class="text-muted-foreground">
      · {{ lastSavedText }}
    </span>
  </span>
</template>
