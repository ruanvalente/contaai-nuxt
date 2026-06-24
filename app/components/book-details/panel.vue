<script setup lang="ts">
import type { Book } from "~/types/book.entity";
import { useFavorites } from "~/composables/use-favorites";
import { useAuthorFollowStore } from "~/composables/use-author-follow";

interface Props {
  book: Book | null;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const router = useRouter();
const { toggleFavorite, isFavorited, isLoading: isFavLoading } = useFavorites();
const {
  follow: followAuthor,
  isFollowing: isAuthorFollowing,
  isLoading: isAuthorLoading,
} = useAuthorFollowStore();

const userRating = ref<number | null>(null);

watch(
  () => props.book?.id,
  async (newId) => {
    if (!newId) return;
    userRating.value = null;
  },
  { immediate: false },
);

const handleReadNow = () => {
  if (props.book) {
    if (!isAuthorFollowing(props.book.author)) {
      followAuthor(props.book.author);
    }
    router.push(`/book/${props.book.id}`);
  }
};

const handleRate = async (rating: number) => {
  if (!props.book) return;
  userRating.value = rating;
  // TODO: implementar persistência da avaliação
};
</script>

<template>
  <div
    v-if="isLoading"
    class="w-full max-w-sm mx-auto bg-white rounded-2xl p-4 shadow-sm"
  >
    <div class="animate-pulse">
      <div class="flex gap-4">
        <div class="w-28 h-40 bg-primary-200 rounded-lg" />
        <div class="flex-1 space-y-2">
          <div class="h-4 w-16 bg-primary-200 rounded-full" />
          <div class="h-5 bg-primary-200 rounded w-3/4" />
          <div class="h-4 bg-primary-200 rounded w-1/2" />
          <div class="h-4 bg-primary-200 rounded w-20" />
        </div>
      </div>
      <div class="grid grid-cols-3 gap-2 mt-4">
        <div v-for="i in 3" :key="i" class="h-16 bg-primary-200 rounded-xl" />
      </div>
    </div>
  </div>

  <div
    v-else-if="!book"
    class="w-full max-w-sm mx-auto bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-64"
  >
    <div
      class="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mb-3"
    >
      <svg
        class="w-6 h-6 text-gray-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    </div>
    <h3 class="text-sm font-semibold text-gray-900 mb-1">Selecione um Livro</h3>
    <p class="text-xs text-gray-500">
      Clique em um livro para ver seus detalhes
    </p>
  </div>

  <div
    v-else
    class="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-sm overflow-hidden"
  >
    <div class="flex gap-4 p-4">
      <div class="shrink-0 relative">
        <SharedUiBookCover
          :title="book.title"
          :cover-url="book.coverUrl ?? ''"
          :cover-color="book.coverColor"
          size="md"
          class="w-28 h-40 sm:w-32 sm:h-44"
        />
        <SharedUiFavoriteButton
          :is-favorited="isFavorited(book.id)"
          :is-loading="isFavLoading"
          class="absolute -top-2 -right-2"
          @click="toggleFavorite(book)"
        />
      </div>

      <div class="flex-1 min-w-0 flex flex-col">
        <SharedUiBadge
          variant="primary"
          class="text-[10px] px-2 py-0.5 self-start mb-1.5"
        >
          {{ book.category }}
        </SharedUiBadge>

        <h2
          class="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-0.5"
        >
          {{ book.title }}
        </h2>

        <p class="text-xs text-gray-500 mb-1.5">{{ book.author }}</p>

        <SharedUiRatingStars
          :rating="book.rating"
          size="sm"
          :show-value="true"
        />

        <SharedUiRatingInput
          :book-id="book.id"
          :current-rating="book.rating"
          :user-rating="userRating"
          size="sm"
          @rate="handleRate"
        />

        <div class="mt-auto pt-2">
          <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {{ book.description }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2 px-4 pb-4">
      <SharedUiMetricsCard label="Páginas" :value="book.pages" class="py-2">
        <SharedUiIcons name="book-open" class="w-3.5 h-3.5 text-gray-500" />
      </SharedUiMetricsCard>
      <SharedUiMetricsCard
        label="Avaliações"
        :value="book.ratingCount"
        class="py-2"
      >
        <SharedUiIcons name="users" class="w-3.5 h-3.5 text-gray-500" />
      </SharedUiMetricsCard>
    </div>

    <div class="px-4 pb-4">
      <SharedUiButton
        variant="primary"
        class="w-full py-2.5 text-sm"
        @click="handleReadNow"
      >
        {{
          isAuthorFollowing(book.author)
            ? "Ler Agora"
            : `Ler Agora + Seguir ${book.author}`
        }}
      </SharedUiButton>
    </div>
  </div>
</template>
