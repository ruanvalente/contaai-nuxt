<script setup lang="ts">
definePageMeta({
  title: "Verifique seu Email",
})

const email = ref('')

onMounted(() => {
  const stored = sessionStorage.getItem('registration_email')
  if (stored) {
    email.value = stored
    sessionStorage.removeItem('registration_email')
  }
})
</script>

<template>
  <SharedUiAuthLayout>
    <SharedUiCard>
      <SharedUiAuthLogo />

      <SharedUiAuthHeader
        title="Verifique seu email"
        subtitle="Enviamos um link de confirmação para o seu email."
      />

      <div class="space-y-6 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0E6D8]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-[#C9A87C]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <p class="text-gray-600">
          <template v-if="email">
            Enviamos um link para <strong class="text-gray-900">{{ email }}</strong>.
          </template>
          <template v-else>
            Enviamos um link de confirmação para o seu email.
          </template>
        </p>

        <p class="text-sm text-gray-500">
          Após confirmar seu email, você poderá fazer login na sua conta.
        </p>

        <NuxtLink
          to="/auth/login"
          class="inline-block mt-4 text-sm text-[#2563EB] transition-colors hover:underline"
        >
          Voltar para entrar
        </NuxtLink>
      </div>
    </SharedUiCard>
  </SharedUiAuthLayout>
</template>
