<script setup lang="ts">
const isMenuOpen = ref(false);
const menuId = "mobile-menu";

const router = useRouter();

const navItems = [
  { label: "Home", href: "#hero", external: false },
  { label: "Explorar", href: "/discover/explore", external: true },
  { label: "Minha Sessão", href: "/discover/my-session", external: true },
  { label: "Comunidade", href: "#community", external: false },
  { label: "Contribuir", href: "#contribute", external: false },
];

function handleNavClick(item: (typeof navItems)[number]) {
  isMenuOpen.value = false;
  if (item.external) {
    router.push(item.href);
  } else {
    const el = document.querySelector(item.href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");
    }
  }
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-default"
  >
    <SharedUiContainer>
      <nav class="flex items-center justify-between h-20">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-2xl font-display font-bold text-highlight">
            Conta<span class="text-primary">AI</span>
          </span>
        </NuxtLink>

        <ul class="hidden md:flex items-center gap-8">
          <li v-for="item in navItems" :key="item.label">
            <UButton
              variant="ghost"
              color="neutral"
              class="text-muted hover:text-primary transition-colors font-sans text-sm"
              @click="handleNavClick(item)"
            >
              {{ item.label }}
            </UButton>
          </li>
        </ul>

        <div class="hidden md:flex items-center gap-4">
          <UButton
            to="/auth/login"
            variant="outline"
            color="neutral"
            label="Entrar"
            class="px-5 py-2 text-sm"
          />
          <UButton
            to="/auth/register"
            label="Criar Conta"
            class="px-5 py-2 text-sm"
          />
        </div>

        <UButton
          :icon="isMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          variant="ghost"
          color="neutral"
          class="md:hidden"
          :aria-expanded="isMenuOpen"
          :aria-controls="menuId"
          :aria-label="isMenuOpen ? 'Fechar menu' : 'Abrir menu'"
          @click="isMenuOpen = !isMenuOpen"
        />
      </nav>
    </SharedUiContainer>

    <Transition name="menu-slide">
      <div
        v-if="isMenuOpen"
        :id="menuId"
        class="md:hidden bg-surface border-t border-default"
        role="menu"
      >
        <SharedUiContainer>
          <ul class="py-4 flex flex-col gap-4">
            <li v-for="item in navItems" :key="item.label">
              <UButton
                variant="ghost"
                color="neutral"
                class="text-muted hover:text-primary transition-colors font-sans text-base block py-2 w-full text-left justify-start"
                @click="handleNavClick(item)"
              >
                {{ item.label }}
              </UButton>
            </li>
            <li class="flex flex-col gap-3 pt-4 border-t border-default">
              <UButton
                to="/auth/login"
                variant="outline"
                color="neutral"
                label="Entrar"
                class="w-full"
                @click="isMenuOpen = false"
              />
              <UButton
                to="/auth/register"
                label="Criar Conta"
                class="w-full"
                @click="isMenuOpen = false"
              />
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
