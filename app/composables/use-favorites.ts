import type { Book } from '~/types/book.entity'

export const useFavorites = () => {
  const favorites = ref<Set<string>>(new Set())
  const isLoading = ref(false)

  const isFavorited = (bookId: string) => {
    return favorites.value.has(bookId)
  }

  const toggleFavorite = (book: Book) => {
    if (favorites.value.has(book.id)) {
      favorites.value.delete(book.id)
    } else {
      favorites.value.add(book.id)
    }
  }

  return {
    isFavorited,
    toggleFavorite,
    isLoading: readonly(isLoading),
  }
}
