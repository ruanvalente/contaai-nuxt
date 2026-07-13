<script setup lang="ts">
const { toasts, removeToast } = useToast();

function getIcon(type: string) {
  switch (type) {
    case 'success':
      return 'M5 13l4 4L19 7';
    case 'error':
      return 'M6 18L18 6M6 6l12 12';
    case 'info':
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  }
}

function getIconColor(type: string) {
  switch (type) {
    case 'success':
      return 'text-green-500';
    case 'error':
      return 'text-red-500';
    case 'info':
    default:
      return 'text-blue-500';
  }
}

function getBgColor(type: string) {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200';
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg',
            getBgColor(toast.type),
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            :class="['h-5 w-5 flex-shrink-0 mt-0.5', getIconColor(toast.type)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              :d="getIcon(toast.type)"
            />
          </svg>
          <p class="flex-1 text-sm text-gray-800">{{ toast.message }}</p>
          <button
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            @click="removeToast(toast.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
