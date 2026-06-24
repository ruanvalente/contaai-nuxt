<script setup lang="ts">
useHead({
  title: "ContaAI - Descubra Autores e Suas Contribuições Literárias",
  meta: [
    {
      name: "description",
      content:
        "Plataforma de compartilhamento de contos, histórias e muito mais. De forma simples e gratuita.",
    },
  ],
  htmlAttrs: {
    lang: "pt-BR",
  },
  bodyAttrs: {
    class: "scroll-smooth",
  },
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <slot />

    <!-- TODO: NotificationManagementWidget -->
  </div>
</template>
