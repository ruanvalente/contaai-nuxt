interface User {
  id: string
  email: string
  name: string
}

export const useAuthStore = () => {
  const user = ref<User | null>(null)
  const isInitialized = ref(false)
  const isLoading = ref(false)

  const initialize = async () => {
    isLoading.value = true
    try {
      // TODO: implementar verificação de sessão
      isInitialized.value = true
    } finally {
      isLoading.value = false
    }
  }

  return {
    user: readonly(user),
    isInitialized: readonly(isInitialized),
    isLoading: readonly(isLoading),
    initialize,
  }
}
