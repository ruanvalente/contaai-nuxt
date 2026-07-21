<script setup lang="ts">
definePageMeta({
  title: "Entrar",
  middleware: "guest",
});

const router = useRouter();
const { login, loading, error, clearError } = useAuthStore();

const email = ref("");
const password = ref("");

const formErrors = reactive({
  email: undefined as string | undefined,
  password: undefined as string | undefined,
});

function validate(): boolean {
  let valid = true;
  formErrors.email = undefined;
  formErrors.password = undefined;

  if (!email.value) {
    formErrors.email = "Email é obrigatório";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    formErrors.email = "Email inválido";
    valid = false;
  }

  if (!password.value) {
    formErrors.password = "Senha é obrigatória";
    valid = false;
  }

  return valid;
}

async function handleSubmit() {
  clearError();
  if (!validate()) return;

  try {
    await login({ email: email.value, password: password.value });
    router.push("/discover");
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
        title="Bem-vindo de volta"
        subtitle="Faça login para acessar sua biblioteca."
      />

      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :description="error"
        class="mb-6"
      />

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField :error="formErrors.email">
          <UInput
            size="lg"
            class="w-full"
            v-model="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
          />
        </UFormField>

        <UFormField :error="formErrors.password">
          <UInput
            class="w-full"
            size="lg"
            v-model="password"
            label="Senha"
            type="password"
            placeholder="••••••••"
          />
        </UFormField>

        <div class="flex justify-end">
          <NuxtLink
            to="/auth/forgot-password"
            class="text-sm text-primary transition-colors hover:underline"
          >
            Esqueceu sua senha?
          </NuxtLink>
        </div>

        <UButton
          class="w-full px-5 py-3 text-base"
          type="submit"
          :loading="loading"
          label="Entrar"
        />
      </form>

      <p class="mt-10 text-center text-sm text-muted">
        Não tem uma conta?
        <NuxtLink
          to="/auth/register"
          class="font-medium text-primary transition-colors hover:underline"
        >
          Criar Conta
        </NuxtLink>
      </p>
    </SharedUiCard>
  </SharedUiAuthLayout>
</template>
