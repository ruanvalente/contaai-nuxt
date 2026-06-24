<script setup lang="ts">
const name = ref('')
const email = ref('')
const password = ref('')
</script>

<template>
  <SharedUiAuthLayout>
    <SharedUiCard>
      <SharedUiAuthLogo />

      <SharedUiAuthHeader
        title="Create your account"
        subtitle="Start your journey with ContaAI"
      />

      <form class="space-y-6">
        <SharedUiInput
          id="name"
          v-model="name"
          label="Full name"
          type="text"
          placeholder="Jane Doe"
        />

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

        <SharedUiButton type="submit">
          Create account
        </SharedUiButton>
      </form>

      <p class="mt-10 text-center text-sm text-[#6B7280]">
        Already have an account?
        <NuxtLink
          to="/auth/login"
          class="font-medium text-[#2563EB] transition-colors hover:underline"
        >
          Sign in
        </NuxtLink>
      </p>
    </SharedUiCard>
  </SharedUiAuthLayout>
</template>
