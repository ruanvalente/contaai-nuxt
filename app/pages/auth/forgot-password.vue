<script setup lang="ts">
definePageMeta({
  title: "Recuperar Senha",
  middleware: "guest",
});

const { forgotPassword, loading, error, clearError } = useAuthStore();

const email = ref("");
const submitted = ref(false);

const emailError = ref("");

function validate(): boolean {
  if (!email.value) {
    emailError.value = "Email é obrigatório";
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = "Email inválido";
    return false;
  }
  emailError.value = "";
  return true;
}

async function handleSubmit() {
  clearError();
  if (!validate()) return;

  try {
    await forgotPassword({ email: email.value });
    submitted.value = true;
  } catch {
    // error is set by the store
  }
}
</script>

<template>
  <SharedUiAuthLayout>
    <SharedUiCard class="px-8 py-4">
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

      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :description="error"
        class="mb-6"
      />

      <form v-if="!submitted" class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField :error="emailError">
          <UInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UButton
          class="w-full px-5 py-3 text-base"
          type="submit"
          :loading="loading"
          label="Enviar link de redefinição"
        />
      </form>

      <div v-else class="text-center">
        <NuxtLink
          to="/auth/login"
          class="mt-6 inline-block text-sm text-primary transition-colors hover:underline"
        >
          Voltar para entrar
        </NuxtLink>
      </div>

      <p v-if="!submitted" class="mt-10 text-center text-sm text-muted">
        Lembra sua senha?
        <NuxtLink
          to="/auth/login"
          class="font-medium text-primary transition-colors hover:underline"
        >
          Voltar para entrar
        </NuxtLink>
      </p>
    </SharedUiCard>
  </SharedUiAuthLayout>
</template>
