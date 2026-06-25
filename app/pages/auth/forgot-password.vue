<script setup lang="ts">
definePageMeta({
  title: "Recuperar Senha",
})

const email = ref("");
</script>

<template>
  <SharedUiAuthLayout>
    <SharedUiCard>
      <SharedUiAuthLogo />

      <SharedUiAuthHeader
        title="Esqueceu sua senha?"
        subtitle="Digite seu email e enviaremos um link para redefinir sua senha."
      />

      <form class="space-y-6">
        <SharedUiInput
          id="email"
          v-model="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
        />

        <SharedUiButton
          class="w-full px-5 py-2 text-md"
          variant="primary"
          type="submit"
        >
          Enviar link de redefinição
        </SharedUiButton>
      </form>

      <p class="mt-10 text-center text-sm text-[#6B7280]">
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
