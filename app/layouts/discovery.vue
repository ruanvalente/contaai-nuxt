<script setup lang="ts">
const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen overflow-x-hidden">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-text-dark"
    >
      Pular para o conteúdo
    </a>
    <LayoutAppSidebar :open="sidebarOpen" @close="closeSidebar" />
    <LayoutAppHeader :sidebar-open="sidebarOpen" @toggle-sidebar="toggleSidebar" />
    <LayoutAppContainer>
      <slot />
    </LayoutAppContainer>
  </div>
</template>
