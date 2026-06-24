<script setup lang="ts">
const name = ref("");
const email = ref("");
const password = ref("");
</script>

<template>
  <SharedUiAuthLayout>
    <SharedUiCard>
      <SharedUiAuthLogo />

      <SharedUiAuthHeader
        title="Crie a sua conta"
        subtitle="Comece sua jornada com ContaAI"
      />

      <form class="space-y-6">
        <SharedUiInput
          id="name"
          v-model="name"
          label="Nome completo"
          type="text"
          placeholder="Jane Doe"
        />

        <SharedUiInput
          id="email"
          v-model="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
        />

        <SharedUiInput
          id="password"
          v-model="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
        />

        <SharedUiButton
          class="w-full px-5 py-2 text-md"
          variant="primary"
          type="submit"
        >
          Criar conta
        </SharedUiButton>
      </form>

      <p class="mt-10 text-center text-sm text-[#6B7280]">
        Já tem uma conta?
        <NuxtLink
          to="/auth/login"
          class="font-medium text-[#2563EB] transition-colors hover:underline"
        >
          Entrar
        </NuxtLink>
      </p>
    </SharedUiCard>
  </SharedUiAuthLayout>
</template>
