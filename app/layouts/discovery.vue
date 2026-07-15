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
  <div class="min-h-screen">
    <LayoutAppSidebar :open="sidebarOpen" @close="closeSidebar" />
    <LayoutAppHeader :sidebar-open="sidebarOpen" @toggle-sidebar="toggleSidebar" />
    <LayoutAppContainer>
      <slot />
    </LayoutAppContainer>
  </div>
</template>
