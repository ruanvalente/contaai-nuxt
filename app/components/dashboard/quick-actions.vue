<script setup lang="ts">
const emit = defineEmits<{
  createBook: [];
}>();

const actions = [
  {
    label: "Novo Livro",
    icon: "i-lucide-plus",
    color: "primary" as const,
    action: "createBook",
  },
  {
    label: "Explorar",
    icon: "i-lucide-search",
    color: "info" as const,
    to: "/discover/explore",
  },
  {
    label: "Minha Sessão",
    icon: "i-lucide-book-open",
    color: "success" as const,
    to: "/discover/my-session",
  },
  {
    label: "Estatísticas",
    icon: "i-lucide-bar-chart-3",
    color: "warning" as const,
    disabled: true,
  },
];

const handleAction = (action: { action?: string; to?: string }) => {
  if (action.action === "createBook") {
    emit("createBook");
  } else if (action.to) {
    navigateTo(action.to);
  }
};
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <UButton
      v-for="action in actions"
      :key="action.label"
      :disabled="action.disabled"
      :class="[
        'flex-col items-center gap-3 p-4 h-auto',
        action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md',
      ]"
      @click="handleAction(action)"
    >
      <div
        :class="[
          'w-12 h-12 rounded-full flex items-center justify-center text-white',
          `bg-${action.color}-500`,
        ]"
      >
        <UIcon :name="action.icon" class="w-6 h-6" />
      </div>
      <span class="text-sm font-medium text-highlight">{{ action.label }}</span>
    </UButton>
  </div>
</template>
