<script setup lang="ts">
definePageMeta({
  title: "Verifique seu Email",
});

const email = ref("");

onMounted(() => {
  const stored = sessionStorage.getItem("registration_email");
  if (stored) {
    email.value = stored;
    sessionStorage.removeItem("registration_email");
  }
});
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
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <UIcon name="i-lucide-mail" class="h-8 w-8 text-primary" />
        </div>

        <p class="text-muted">
          <template v-if="email">
            Enviamos um link para <strong class="text-highlight">{{ email }}</strong>.
          </template>
          <template v-else>
            Enviamos um link de confirmação para o seu email.
          </template>
        </p>

        <p class="text-sm text-muted/70">
          Após confirmar seu email, você poderá fazer login na sua conta.
        </p>

        <NuxtLink
          to="/auth/login"
          class="inline-block mt-4 text-sm text-primary transition-colors hover:underline"
        >
          Voltar para entrar
        </NuxtLink>
      </div>
    </SharedUiCard>
  </SharedUiAuthLayout>
</template>
