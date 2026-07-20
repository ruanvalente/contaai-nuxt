<script setup lang="ts">
const { toasts, removeToast } = useToast();

function getColor(type: string) {
  switch (type) {
    case "success":
      return "success" as const;
    case "error":
      return "error" as const;
    default:
      return "info" as const;
  }
}

function getIcon(type: string) {
  switch (type) {
    case "success":
      return "i-lucide-check-circle";
    case "error":
      return "i-lucide-x-circle";
    default:
      return "i-lucide-info";
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
      >
        <UAlert
          v-for="toast in toasts"
          :key="toast.id"
          :color="getColor(toast.type)"
          :icon="getIcon(toast.type)"
          :title="toast.message"
          :close="{ onClick: () => removeToast(toast.id) }"
          class="pointer-events-auto"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>
