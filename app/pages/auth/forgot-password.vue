<script setup lang="ts">
const email = ref('')
</script>

<template>
  <SharedUiAuthLayout>
    <SharedUiCard>
      <SharedUiAuthLogo />

      <SharedUiAuthHeader
        title="Forgot your password?"
        subtitle="Enter your email and we'll send you a reset link"
      />

      <form class="space-y-6">
        <SharedUiInput
          id="email"
          v-model="email"
          label="Email"
          type="email"
          placeholder="you@email.com"
        />

        <SharedUiButton type="submit">
          Send Reset Link
        </SharedUiButton>
      </form>

      <p class="mt-10 text-center text-sm text-[#6B7280]">
        Remember your password?
        <NuxtLink
          to="/auth/login"
          class="font-medium text-[#2563EB] transition-colors hover:underline"
        >
          Back to sign in
        </NuxtLink>
      </p>
    </SharedUiCard>
  </SharedUiAuthLayout>
</template>
