<script setup lang="ts">
const router = useRouter()
const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true
})
</script>

<template>
  <section id="hero" class="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden scroll-mt-20">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-display font-bold text-gray-900 opacity-[0.03] whitespace-nowrap">
        CONTOS & HISTÓRIAS
      </span>
    </div>

    <SharedUiContainer class="relative z-10 py-20">
      <div class="max-w-3xl mx-auto text-center">
        <h1
          :class="[
            'text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 leading-tight mb-6 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          ]"
        >
          Descubra Autores e Suas
          <span class="text-accent-500">Contribuições</span> Literárias
        </h1>

        <p
          :class="[
            'text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          ]"
        >
          Uma plataforma de compartilhamento de contos, histórias e o que você
          quiser mais contar. De forma simples, gratuita e elegante.
        </p>

        <div
          :class="[
            'flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          ]"
        >
          <SharedUiButton variant="primary" class="px-8 py-4 text-lg" @click="router.push('/explore')">
            Explorar
          </SharedUiButton>
          <SharedUiButton variant="secondary" class="px-8 py-4 text-lg gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Assistir vídeo
          </SharedUiButton>
        </div>
      </div>
    </SharedUiContainer>
  </section>
</template>
