<script setup lang="ts">
definePageMeta({
  title: "Dashboard",
  middleware: 'auth',
})

const router = useRouter()
const { user, isInitialized, isLoading, initialize, logout } = useAuthStore()

const loggingOut = ref(false)

onMounted(() => {
  initialize()
})

async function handleLogout() {
  loggingOut.value = true
  try {
    await logout()
    router.push('/auth/login')
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <div v-if="!isInitialized || isLoading" class="min-h-screen bg-primary-100 pt-20" />

  <div v-else class="min-h-screen bg-primary-100 pt-20">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-2">
        Olá, {{ user?.name || 'Leitor' }}
      </h1>
      <p class="text-gray-600 mb-10">
        Bem-vindo ao ContaAI
      </p>

      <div class="mb-10">
        <button
          :disabled="loggingOut"
          class="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          @click="handleLogout"
        >
          <svg
            v-if="loggingOut"
            class="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <NuxtLink
          to="/my-session"
          class="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-sm transition-shadow"
        >
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Minha Sessão</h3>
              <p class="text-sm text-gray-500">Favoritos e histórico</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/explore"
          class="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-sm transition-shadow"
        >
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Explorar</h3>
              <p class="text-sm text-gray-500">Descubra novas obras</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/criar-livro"
          class="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-sm transition-shadow"
        >
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Criar Livro</h3>
              <p class="text-sm text-gray-500">Publique sua história</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
