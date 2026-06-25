import type { BookListItem, ApiBook } from '~/types/book.entity'
import { mapApiToBookListItem } from '~/types/book.entity'

export const useBooks = () => {
  const { data, pending, error: fetchError, refresh } = useFetch('/api/books', {
    transform: (data: ApiBook[]): BookListItem[] => data.map(mapApiToBookListItem),
  })

  const books = computed(() => data.value ?? [])
  const error = computed(() => fetchError.value ? 'Falha ao carregar livros' : null)

  return {
    books,
    isLoading: pending,
    error,
    fetchBooks: refresh,
  }
}
