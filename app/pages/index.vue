<script setup lang="ts">
import type { Book, BookListItem } from "~/types/book.entity";
import { mapToBook } from "~/types/book.entity";

definePageMeta({
  title: "ContaAI",
})

const router = useRouter();
const { user, isInitialized, initialize } = useAuthStore();

const selectedBook = ref<Book | null>(null);
const { books } = useBooks();

onMounted(() => {
  initialize();
});

watch([user, isInitialized], ([newUser, initialized]) => {
  if (initialized && newUser) {
    router.replace("/dashboard");
  }
});

const handleBookSelect = (book: BookListItem) => {
  selectedBook.value = mapToBook(book);
};

const handleClearSelection = () => {
  selectedBook.value = null;
};
</script>

<template>
  <main class="min-h-screen bg-primary-100">
    <LandingHeader />
    <LandingHero />

    <LandingBooksShowcase
      :initial-books="books"
      @book-select="handleBookSelect"
    />

    <section id="community" class="py-20 bg-primary-100 scroll-mt-20">
      <SharedUiContainer>
        <div class="text-center mb-12">
          <h2
            class="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4"
          >
            Comunidade
          </h2>
          <p class="text-gray-700 max-w-xl mx-auto">
            Conecte-se com outros escritores e amantes da literatura.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div
            v-for="item in [
              {
                title: 'Fóruns de Discussão',
                desc: 'Participe de conversas sobre literatura',
              },
              {
                title: 'Eventos Literários',
                desc: 'Workshops e encontros online',
              },
              {
                title: 'Feedback entre Autores',
                desc: 'Receba e ofereça críticas construtivas',
              },
              {
                title: 'Desafios de Escrita',
                desc: 'Participe de desafios mensais',
              },
            ]"
            :key="item.title"
            class="bg-accent-100 rounded-lg p-6 hover:bg-accent-100/80 transition-colors cursor-pointer"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ item.title }}
            </h3>
            <p class="text-gray-600 text-sm">{{ item.desc }}</p>
          </div>
        </div>
      </SharedUiContainer>
    </section>

    <section id="contribute" class="py-20 bg-primary-200 scroll-mt-20">
      <SharedUiContainer>
        <div class="text-center">
          <h2
            class="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4"
          >
            Contribua
          </h2>
          <p class="text-gray-700 max-w-xl mx-auto mb-8">
            Compartilhe suas histórias com a comunidade. É grátis e simples.
          </p>
          <NuxtLink
            to="/auth/register"
            class="inline-block bg-accent-500 text-white px-8 py-4 rounded-full font-medium hover:bg-accent-600 transition-colors"
          >
            Criar Conta
          </NuxtLink>
        </div>
      </SharedUiContainer>
    </section>

    <footer class="py-12 bg-primary-300">
      <SharedUiContainer>
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <span class="text-xl font-display font-bold text-gray-900">
              Conta<span class="text-accent-500">AI</span>
            </span>
            <p class="text-gray-700 text-sm mt-2">
              Compartilhando histórias desde 2026
            </p>
          </div>
          <div class="flex gap-6">
            <a
              href="#"
              class="text-gray-700 hover:text-accent-500 transition-colors text-sm"
              >Termos</a
            >
            <a
              href="#"
              class="text-gray-700 hover:text-accent-500 transition-colors text-sm"
              >Privacidade</a
            >
            <a
              href="#"
              class="text-gray-700 hover:text-accent-500 transition-colors text-sm"
              >Contato</a
            >
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700/20 text-center">
          <p class="text-gray-500 text-sm">
            &copy; 2026 ContaAI. Todos os direitos reservados.
          </p>
        </div>
      </SharedUiContainer>
    </footer>

    <LazyBookDetailsModal :book="selectedBook" @close="handleClearSelection" />
  </main>
</template>
