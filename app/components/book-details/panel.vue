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
    class="w-full max-w-sm mx-auto bg-surface rounded-2xl p-4 shadow-sm"
  >
    <div class="flex gap-4">
      <USkeleton class="w-28 h-40 rounded-lg" />
      <div class="flex-1 space-y-2">
        <USkeleton class="h-4 w-16 rounded-full" />
        <USkeleton class="h-5 w-3/4" />
        <USkeleton class="h-4 w-1/2" />
        <USkeleton class="h-4 w-20" />
      </div>
    </div>
    <div class="grid grid-cols-3 gap-2 mt-4">
      <USkeleton v-for="i in 3" :key="i" class="h-16 rounded-xl" />
    </div>
  </div>

  <div
    v-else-if="!book"
    class="w-full max-w-sm mx-auto bg-surface rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-64"
  >
    <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
      <UIcon name="i-lucide-book-open" class="w-6 h-6 text-muted" />
    </div>
    <h3 class="text-sm font-semibold text-highlight mb-1">Selecione um Livro</h3>
    <p class="text-xs text-muted">
      Clique em um livro para ver seus detalhes
    </p>
  </div>

  <div
    v-else
    class="w-full max-w-sm mx-auto bg-surface rounded-2xl shadow-sm overflow-hidden"
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
        <UBadge color="primary" variant="subtle" size="xs" class="self-start mb-1.5">
          {{ book.category }}
        </UBadge>

        <h2 class="text-sm font-semibold text-highlight leading-tight line-clamp-2 mb-0.5">
          {{ book.title }}
        </h2>

        <p class="text-xs text-muted mb-1.5">{{ book.author }}</p>

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
          <p class="text-xs text-muted line-clamp-2 leading-relaxed">
            {{ book.description }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2 px-4 pb-4">
      <SharedUiMetricsCard label="Páginas" :value="book.pages" class="py-2">
        <UIcon name="i-lucide-book-open" class="w-3.5 h-3.5 text-muted" />
      </SharedUiMetricsCard>
      <SharedUiMetricsCard label="Avaliações" :value="book.ratingCount" class="py-2">
        <UIcon name="i-lucide-users" class="w-3.5 h-3.5 text-muted" />
      </SharedUiMetricsCard>
    </div>

    <div class="px-4 pb-4">
      <UButton
        class="w-full py-2.5 text-sm"
        @click="handleReadNow"
      >
        {{
          isAuthorFollowing(book.author)
            ? "Ler Agora"
            : `Ler Agora + Seguir ${book.author}`
        }}
      </UButton>
    </div>
  </div>
</template>
