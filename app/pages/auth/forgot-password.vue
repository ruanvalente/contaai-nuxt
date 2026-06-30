<script setup lang="ts">
definePageMeta({
  title: "Recuperar Senha",
  middleware: 'guest',
})

const { forgotPassword, loading, error, clearError } = useAuthStore()

const email = ref('')
const submitted = ref(false)

const emailError = ref('')

function validate(): boolean {
  if (!email.value) {
    emailError.value = 'Email é obrigatório'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Email inválido'
    return false
  }
  emailError.value = ''
  return true
}

async function handleSubmit() {
  clearError()
  if (!validate()) return

  try {
    await forgotPassword({ email: email.value })
    submitted.value = true
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
        v-if="!submitted"
        title="Esqueceu sua senha?"
        subtitle="Digite seu email e enviaremos um link para redefinir sua senha."
      />

      <SharedUiAuthHeader
        v-else
        title="Email enviado!"
        subtitle="Verifique sua caixa de entrada e siga as instruções para redefinir sua senha."
      />

      <div
        v-if="error"
        class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {{ error }}
      </div>

      <form v-if="!submitted" class="space-y-6" @submit.prevent="handleSubmit">
        <div>
          <SharedUiInput
            id="email"
            v-model="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
          />
          <p v-if="emailError" class="mt-1.5 text-sm text-red-500">
            {{ emailError }}
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
          Enviar link de redefinição
        </SharedUiButton>
      </form>

      <div v-else class="text-center">
        <NuxtLink
          to="/auth/login"
          class="mt-6 inline-block text-sm text-[#2563EB] transition-colors hover:underline"
        >
          Voltar para entrar
        </NuxtLink>
      </div>

      <p v-if="!submitted" class="mt-10 text-center text-sm text-[#6B7280]">
        Lembra sua senha?
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
