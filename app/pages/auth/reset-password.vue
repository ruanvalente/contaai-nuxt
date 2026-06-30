<script setup lang="ts">
definePageMeta({
  title: "Redefinir Senha",
})

const router = useRouter()
const client = useSupabaseClient()
const { updatePassword, loading, error, clearError } = useAuthStore()

const password = ref('')
const confirmPassword = ref('')
const isRecovery = ref(false)
const successMessage = ref('')

const formErrors = reactive({
  password: '',
  confirmPassword: '',
})

onMounted(async () => {
  const { data: { session } } = await client.auth.getSession()
  isRecovery.value = !!session
})

function validate(): boolean {
  let valid = true
  formErrors.password = ''
  formErrors.confirmPassword = ''

  if (!password.value) {
    formErrors.password = 'Nova senha é obrigatória'
    valid = false
  } else if (password.value.length < 8) {
    formErrors.password = 'Mínimo de 8 caracteres'
    valid = false
  }

  if (!confirmPassword.value) {
    formErrors.confirmPassword = 'Confirme a nova senha'
    valid = false
  } else if (password.value !== confirmPassword.value) {
    formErrors.confirmPassword = 'Senhas não coincidem'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  clearError()
  if (!validate()) return

  try {
    await updatePassword({ password: password.value })
    successMessage.value = 'Senha redefinida com sucesso!'
    setTimeout(() => router.push('/auth/login'), 2000)
  } catch {
    // error is set by the store
  }
}
</script>

<template>
  <SharedUiAuthLayout>
    <SharedUiCard>
      <SharedUiAuthLogo />

      <SharedUiAuthHeader
        v-if="isRecovery"
        title="Redefinir senha"
        subtitle="Escolha uma nova senha para sua conta."
      />

      <SharedUiAuthHeader
        v-else
        title="Link inválido"
        subtitle="Este link de redefinição é inválido ou expirou."
      />

      <div
        v-if="error"
        class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {{ error }}
      </div>
      <div
        v-if="successMessage"
        class="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        role="status"
      >
        {{ successMessage }}
      </div>

      <form
        v-if="isRecovery && !successMessage"
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <div>
          <SharedUiInput
            id="new-password"
            v-model="password"
            label="Nova senha"
            type="password"
            placeholder="••••••••"
          />
          <p v-if="formErrors.password" class="mt-1.5 text-sm text-red-500">
            {{ formErrors.password }}
          </p>
        </div>

        <div>
          <SharedUiInput
            id="confirm-password"
            v-model="confirmPassword"
            label="Confirmar nova senha"
            type="password"
            placeholder="••••••••"
          />
          <p v-if="formErrors.confirmPassword" class="mt-1.5 text-sm text-red-500">
            {{ formErrors.confirmPassword }}
          </p>
        </div>

        <SharedUiButton
          class="w-full px-5 py-3 text-base"
          type="submit"
          variant="primary"
          :disabled="loading"
        >
          <svg
            v-if="loading"
            class="mr-2 h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Redefinir senha
        </SharedUiButton>
      </form>

      <div v-if="!isRecovery && !successMessage" class="text-center">
        <NuxtLink
          to="/auth/forgot-password"
          class="text-sm text-[#2563EB] transition-colors hover:underline"
        >
          Solicitar novo link
        </NuxtLink>
      </div>

      <p
        v-if="!successMessage"
        class="mt-10 text-center text-sm text-[#6B7280]"
      >
        <NuxtLink
          to="/auth/login"
          class="font-medium text-[#2563EB] transition-colors hover:underline"
        >
          Voltar para entrar
        </NuxtLink>
      </p>
    </SharedUiCard>
  </SharedUiAuthLayout>
</template>
