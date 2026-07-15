<script setup lang="ts">
const isMenuOpen = ref(false);
const menuId = "mobile-menu";

const router = useRouter()

const navItems = [
  { label: "Home", href: "#hero", external: false },
  { label: "Explorar", href: "/dashboard/explore", external: true },
  { label: "Minha Sessão", href: "/dashboard/my-session", external: true },
  { label: "Comunidade", href: "#community", external: false },
  { label: "Contribuir", href: "#contribute", external: false },
];

function handleNavClick(item: typeof navItems[number]) {
  isMenuOpen.value = false
  if (item.external) {
    router.push(item.href)
  } else {
    const el = document.querySelector(item.href)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push("/")
    }
  }
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-primary-100/80 backdrop-blur-md border-b border-primary-300"
  >
    <SharedUiContainer>
      <nav class="flex items-center justify-between h-20">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-2xl font-display font-bold text-gray-900">
            Conta<span class="text-accent-500">AI</span>
          </span>
        </NuxtLink>

        <ul class="hidden md:flex items-center gap-8">
          <li v-for="item in navItems" :key="item.label">
            <button
              class="text-gray-700 hover:text-accent-500 transition-colors font-sans text-sm"
              @click="handleNavClick(item)"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>

        <div class="hidden md:flex items-center gap-4">
          <NuxtLink to="/auth/login">
            <SharedUiButton variant="secondary" class="px-5 py-2 text-sm">
              Entrar
            </SharedUiButton>
          </NuxtLink>
          <NuxtLink to="/auth/register">
            <SharedUiButton variant="primary" class="px-5 py-2 text-sm">
              Criar Conta
            </SharedUiButton>
          </NuxtLink>
        </div>

        <button
          class="md:hidden p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          @click="isMenuOpen = !isMenuOpen"
          :aria-expanded="isMenuOpen"
          :aria-controls="menuId"
          :aria-label="isMenuOpen ? 'Fechar menu' : 'Abrir menu'"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path v-if="isMenuOpen" d="M6 6l12 12M6 18L18 6" />
            <path v-else d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </nav>
    </SharedUiContainer>

    <Transition name="menu-slide">
      <div
        v-if="isMenuOpen"
        :id="menuId"
        class="md:hidden bg-primary-100 border-t border-primary-300"
        role="menu"
      >
        <SharedUiContainer>
          <ul class="py-4 flex flex-col gap-4">
            <li v-for="item in navItems" :key="item.label">
              <button
                class="text-gray-700 hover:text-accent-500 transition-colors font-sans text-base block py-2 w-full text-left"
                @click="handleNavClick(item)"
              >
                {{ item.label }}
              </button>
            </li>
            <li class="flex flex-col gap-3 pt-4 border-t border-primary-300">
              <NuxtLink to="/auth/login" class="w-full" @click="isMenuOpen = false">
                <SharedUiButton variant="secondary" class="w-full">
                  Entrar
                </SharedUiButton>
              </NuxtLink>
              <NuxtLink
                to="/auth/register"
                class="w-full"
                @click="isMenuOpen = false"
              >
                <SharedUiButton variant="primary" class="w-full">
                  Criar Conta
                </SharedUiButton>
              </NuxtLink>
            </li>
          </ul>
        </SharedUiContainer>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: all 0.3s ease;
}
.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
  height: 0;
}
.menu-slide-enter-to,
.menu-slide-leave-from {
  opacity: 1;
  height: auto;
}
</style>
