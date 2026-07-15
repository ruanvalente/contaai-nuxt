import type { BookListItem, ApiBook } from "~/types/book.entity";
import { mapApiToBookListItem } from "~/types/book.entity";

const discoveryCache = new Map<
  string,
  { data: { items: BookListItem[]; total: number }; timestamp: number }
>();
const CACHE_TTL = 300_000;

export const useDiscoveryBooks = () => {
  const route = useRoute();
  const router = useRouter();

  const accumulatedBooks = ref<BookListItem[]>([]);
  const total = ref(0);
  const isLoadingMore = ref(false);
  const loadMoreError = ref<string | null>(null);
  const limit = 20;

  const searchQuery = ref((route.query.search as string) || "");
  const selectedCategory = ref((route.query.category as string) || "all");

  watch(
    () => route.query.category,
    (val) => {
      selectedCategory.value = (val as string) || "all";
    },
  );

  watch(
    () => route.query.search,
    (val) => {
      searchQuery.value = (val as string) || "";
    },
  );

  const queryParams = computed(() => {
    const q: Record<string, string> = { limit: String(limit), offset: "0" };
    if (selectedCategory.value && selectedCategory.value !== "all") {
      q.category = selectedCategory.value;
    }
    if (searchQuery.value) {
      q.search = searchQuery.value;
    }
    return q;
  });

  const fetchKey = computed(
    () => `discovery-books-${JSON.stringify(queryParams.value)}`,
  );

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
      const cached = discoveryCache.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data as any;
      }
      discoveryCache.delete(key);
      return undefined;
    },
  });

  watch(
    data,
    (newData) => {
      if (newData) {
        accumulatedBooks.value = newData.items;
        total.value = newData.total;
        discoveryCache.set(fetchKey.value, {
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
    loadMoreError.value = null;
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
    } catch (e) {
      loadMoreError.value = "Falha ao carregar mais livros";
    } finally {
      isLoadingMore.value = false;
    }
  }

  function updateUrlParams() {
    const query: Record<string, string> = {};
    if (selectedCategory.value && selectedCategory.value !== "all") {
      query.category = selectedCategory.value;
    }
    if (searchQuery.value) {
      query.search = searchQuery.value;
    }
    router.replace({ query });
  }

  function setCategory(categoryId: string) {
    selectedCategory.value = categoryId;
    updateUrlParams();
  }

  function setSearch(query: string) {
    searchQuery.value = query;
    updateUrlParams();
  }

  return {
    books: accumulatedBooks,
    isLoading: pending,
    isLoadingMore,
    error: computed(() => fetchError.value || loadMoreError.value),
    hasMore,
    total,
    searchQuery,
    selectedCategory,
    setCategory,
    setSearch,
    fetchBooks: refresh,
    loadMore,
  };
};
