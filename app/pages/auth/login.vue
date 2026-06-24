<script setup lang="ts">
const email = ref('')
const password = ref('')
</script>

<template>
  <SharedUiAuthLayout>
    <SharedUiCard>
      <SharedUiAuthLogo />

      <SharedUiAuthHeader
        title="Welcome back"
        subtitle="Sign in to access your library"
      />

      <form class="space-y-6">
        <SharedUiInput
          id="email"
          v-model="email"
          label="Email"
          type="email"
          placeholder="you@email.com"
        />

        <SharedUiInput
          id="password"
          v-model="password"
          label="Password"
          type="password"
          placeholder="••••••••"
        />

        <div class="flex justify-end">
          <NuxtLink
            to="/auth/forgot-password"
            class="text-sm text-[#2563EB] transition-colors hover:underline"
          >
            Forgot your password?
          </NuxtLink>
        </div>

        <SharedUiButton type="submit">
          Sign In
        </SharedUiButton>
      </form>

      <p class="mt-10 text-center text-sm text-[#6B7280]">
        Don't have an account?
        <NuxtLink
          to="/auth/register"
          class="font-medium text-[#2563EB] transition-colors hover:underline"
        >
          Sign up
        </NuxtLink>
      </p>
    </SharedUiCard>
  </SharedUiAuthLayout>
</template>
