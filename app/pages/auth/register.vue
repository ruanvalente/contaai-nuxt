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
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

function validate(): boolean {
  let valid = true;
  formErrors.name = "";
  formErrors.email = "";
  formErrors.password = "";
  formErrors.confirmPassword = "";

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
    <SharedUiCard>
      <SharedUiAuthLogo />

      <SharedUiAuthHeader
        title="Crie a sua conta"
        subtitle="Comece sua jornada com ContaAI"
      />

      <div
        v-if="error"
        class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {{ error }}
      </div>
      <div
        v-if="successMessage"
        class="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        role="status"
      >
        {{ successMessage }}
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div>
          <SharedUiInput
            id="name"
            v-model="name"
            label="Nome completo"
            type="text"
            placeholder="Jane Doe"
          />
          <p v-if="formErrors.name" class="mt-1.5 text-sm text-red-500">
            {{ formErrors.name }}
          </p>
        </div>

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

        <div>
          <SharedUiInput
            id="confirm-password"
            v-model="confirmPassword"
            label="Confirmar senha"
            type="password"
            placeholder="••••••••"
          />
          <p
            v-if="formErrors.confirmPassword"
            class="mt-1.5 text-sm text-red-500"
          >
            {{ formErrors.confirmPassword }}
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
