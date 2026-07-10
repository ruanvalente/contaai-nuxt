<script setup lang="ts">
const { user, isInitialized, initialize, logout } = useAuthStore();
const { error: toastError } = useToast();
const sidebarOpen = ref(false);
const loggingOut = ref(false);
const router = useRouter();

onMounted(() => {
  initialize();
});

async function handleLogout() {
  loggingOut.value = true;
  try {
    await logout();
    router.push("/auth/login");
  } catch (e) {
    toastError('Erro ao sair. Tente novamente.');
  } finally {
    loggingOut.value = false;
  }
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

function closeSidebar() {
  sidebarOpen.value = false;
}
</script>

<template>
  <div v-if="!isInitialized" class="min-h-screen bg-primary-100" />

  <div v-else class="min-h-screen bg-primary-100">
    <DashboardHeader :user="user" @toggle-sidebar="toggleSidebar" />

    <DashboardSidebar
      :user="user"
      :open="sidebarOpen"
      :logging-out="loggingOut"
      @close="closeSidebar"
      @logout="handleLogout"
    />

    <main class="lg:ml-64 pt-16 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </div>
    </main>

    <SharedUiToast />
  </div>
</template>
