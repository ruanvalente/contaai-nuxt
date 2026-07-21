<script setup lang="ts">
definePageMeta({
  title: "Criar Conta",
  middleware: "guest",
});

const router = useRouter();
const { register, loading, error, clearError } = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const successMessage = ref("");

const formErrors = reactive({
  name: undefined as string | undefined,
  email: undefined as string | undefined,
  password: undefined as string | undefined,
  confirmPassword: undefined as string | undefined,
});

function validate(): boolean {
  let valid = true;
  formErrors.name = undefined;
  formErrors.email = undefined;
  formErrors.password = undefined;
  formErrors.confirmPassword = undefined;

  if (!name.value.trim()) {
    formErrors.name = "Nome é obrigatório";
    valid = false;
  }

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
  } else if (password.value.length < 8) {
    formErrors.password = "Mínimo de 8 caracteres";
    valid = false;
  }

  if (!confirmPassword.value) {
    formErrors.confirmPassword = "Confirme sua senha";
    valid = false;
  } else if (password.value !== confirmPassword.value) {
    formErrors.confirmPassword = "Senhas não coincidem";
    valid = false;
  }

  return valid;
}

async function handleSubmit() {
  clearError();
  if (!validate()) return;

  try {
    const data = await register({
      name: name.value.trim(),
      email: email.value,
      password: password.value,
    });

    if (data.session) {
      router.push("/discover");
    } else {
      successMessage.value =
        "Conta criada! Verifique seu email para confirmar o cadastro.";
    }
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
        title="Crie a sua conta"
        subtitle="Comece sua jornada com ContaAI"
      />

      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :description="error"
        class="mb-6"
      />
      <UAlert
        v-if="successMessage"
        color="success"
        variant="subtle"
        :description="successMessage"
        class="mb-6"
      />

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField :error="formErrors.name">
          <UInput
            v-model="name"
            label="Nome completo"
            type="text"
            placeholder="Jane Doe"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField :error="formErrors.email">
          <UInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField :error="formErrors.password">
          <UInput
            v-model="password"
            label="Senha"
            type="password"
            placeholder="••••••••"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField :error="formErrors.confirmPassword">
          <UInput
            v-model="confirmPassword"
            label="Confirmar senha"
            type="password"
            placeholder="••••••••"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UButton
          class="w-full px-5 py-3 text-base"
          type="submit"
          :loading="loading"
          label="Criar conta"
        />
      </form>

      <p class="mt-10 text-center text-sm text-muted">
        Já tem uma conta?
        <NuxtLink
          to="/auth/login"
          class="font-medium text-primary transition-colors hover:underline"
        >
          Entrar
        </NuxtLink>
      </p>
    </SharedUiCard>
  </SharedUiAuthLayout>
</template>
