<script setup lang="ts">
const email = ref("");
const password = ref("");
</script>

<template>
  <SharedUiAuthLayout>
    <SharedUiCard>
      <SharedUiAuthLogo />

      <SharedUiAuthHeader
        title="Bem-vindo de volta"
        subtitle="Faça login para acessar sua biblioteca."
      />

      <form class="space-y-6">
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

        <div class="flex justify-end">
          <NuxtLink
            to="/auth/forgot-password"
            class="text-sm text-[#2563EB] transition-colors hover:underline"
          >
            Esqueceu sua senha?
          </NuxtLink>
        </div>

        <SharedUiButton
          class="w-full px-5 py-2 text-md"
          variant="primary"
          type="submit"
        >
          Entrar
        </SharedUiButton>
      </form>

      <p class="mt-10 text-center text-sm text-[#6B7280]">
        Não tem uma conta?
        <NuxtLink
          to="/auth/register"
          class="font-medium text-[#2563EB] transition-colors hover:underline"
        >
          Criar Conta
        </NuxtLink>
      </p>
    </SharedUiCard>
  </SharedUiAuthLayout>
</template>
