import type { BookListItem, ApiBook } from "~/types/book.entity";
import { mapApiToBookListItem } from "~/types/book.entity";

const responseCache = new Map<
  string,
  { data: { items: BookListItem[]; total: number }; timestamp: number }
>();
const CACHE_TTL = 300_000;

export const useBooks = () => {
  const route = useRoute();

  const accumulatedBooks = ref<BookListItem[]>([]);
  const total = ref(0);
  const isLoadingMore = ref(false);
  const limit = 20;

  const queryParams = computed(() => {
    const q: Record<string, string> = { limit: String(limit), offset: "0" };
    const category = route.query.category as string | undefined;
    const search = route.query.search as string | undefined;
    if (category && category !== "All") {
      q.category = category;
    }
    if (search) {
      q.search = search;
    }
    return q;
  });

  const fetchKey = computed(() => `books-${JSON.stringify(queryParams.value)}`);

  const { data, pending, error, refresh } = useFetch("/api/books", {
    key: fetchKey,
    query: queryParams,
    transform: (res: { items: ApiBook[]; total: number }) => ({
      items: res.items.map(mapApiToBookListItem),
      total: res.total,
    }),
    getCachedData: (key, nuxtApp) => {
      if (nuxtApp.isHydrating) {
        return nuxtApp.payload.data[key] as
          | { items: BookListItem[]; total: number }
          | undefined;
      }
      const cached = responseCache.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data as any;
      }
      responseCache.delete(key);
      return undefined;
    },
  });

  watch(
    data,
    (newData) => {
      if (newData) {
        accumulatedBooks.value = newData.items;
        total.value = newData.total;
        responseCache.set(fetchKey.value, {
          data: newData,
          timestamp: Date.now(),
        });
      }
    },
    { immediate: true },
  );

  const hasMore = computed(() => accumulatedBooks.value.length < total.value);
  const fetchError = computed(() =>
    error.value ? "Falha ao carregar livros" : null,
  );

  async function loadMore() {
    if (isLoadingMore.value || !hasMore.value) return;
    isLoadingMore.value = true;
    try {
      const offset = accumulatedBooks.value.length;
      const res = await $fetch<{ items: ApiBook[]; total: number }>(
        "/api/books",
        {
          query: { ...queryParams.value, offset: String(offset) },
        },
      );
      accumulatedBooks.value.push(...res.items.map(mapApiToBookListItem));
      total.value = res.total;
    } finally {
      isLoadingMore.value = false;
    }
  }

  return {
    books: accumulatedBooks,
    isLoading: pending,
    isLoadingMore,
    error: fetchError,
    hasMore,
    total,
    fetchBooks: refresh,
    loadMore,
  };
};
