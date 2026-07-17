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
  email: "",
  password: "",
});

function validate(): boolean {
  let valid = true;
  formErrors.email = "";
  formErrors.password = "";

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
    <SharedUiCard>
      <SharedUiAuthLogo />

      <SharedUiAuthHeader
        title="Bem-vindo de volta"
        subtitle="Faça login para acessar sua biblioteca."
      />

      <div
        v-if="error"
        class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {{ error }}
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div>
          <SharedUiInput
            id="email"
            v-model="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
          />
          <p v-if="formErrors.email" class="mt-1.5 text-sm text-red-500">
            {{ formErrors.email }}
          </p>
        </div>

        <div>
          <SharedUiInput
            id="password"
            v-model="password"
            label="Senha"
            type="password"
            placeholder="••••••••"
          />
          <p v-if="formErrors.password" class="mt-1.5 text-sm text-red-500">
            {{ formErrors.password }}
          </p>
        </div>

        <div class="flex justify-end">
          <NuxtLink
            to="/auth/forgot-password"
            class="text-sm text-[#2563EB] transition-colors hover:underline"
          >
            Esqueceu sua senha?
          </NuxtLink>
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
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
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
