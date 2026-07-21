<script setup lang="ts">
definePageMeta({
  title: "Redefinir Senha",
});

const router = useRouter();
const client = useSupabaseClient();
const { updatePassword, loading, error, clearError } = useAuthStore();

const password = ref("");
const confirmPassword = ref("");
const isRecovery = ref(false);
const successMessage = ref("");

const formErrors = reactive({
  password: "",
  confirmPassword: "",
});

onMounted(async () => {
  const {
    data: { session },
  } = await client.auth.getSession();
  isRecovery.value = !!session;
});

function validate(): boolean {
  let valid = true;
  formErrors.password = "";
  formErrors.confirmPassword = "";

  if (!password.value) {
    formErrors.password = "Nova senha é obrigatória";
    valid = false;
  } else if (password.value.length < 8) {
    formErrors.password = "Mínimo de 8 caracteres";
    valid = false;
  }

  if (!confirmPassword.value) {
    formErrors.confirmPassword = "Confirme a nova senha";
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
    await updatePassword({ password: password.value });
    successMessage.value = "Senha redefinida com sucesso!";
    setTimeout(() => router.push("/auth/login"), 2000);
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
        v-if="isRecovery"
        title="Redefinir senha"
        subtitle="Escolha uma nova senha para sua conta."
      />

      <SharedUiAuthHeader
        v-else
        title="Link inválido"
        subtitle="Este link de redefinição é inválido ou expirou."
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

      <form
        v-if="isRecovery && !successMessage"
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <UFormField :error="formErrors.password">
          <UInput
            v-model="password"
            label="Nova senha"
            type="password"
            placeholder="••••••••"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField :error="formErrors.confirmPassword">
          <UInput
            v-model="confirmPassword"
            label="Confirmar nova senha"
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
          label="Redefinir senha"
        />
      </form>

      <div v-if="!isRecovery && !successMessage" class="text-center">
        <NuxtLink
          to="/auth/forgot-password"
          class="text-sm text-primary transition-colors hover:underline"
        >
          Solicitar novo link
        </NuxtLink>
      </div>

      <p v-if="!successMessage" class="mt-10 text-center text-sm text-muted">
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
