import type { CreateBookPayload } from '~/types/dashboard'
import type { UserBook } from '~/types/user-book'

const books = ref<UserBook[]>([])
const isLoading = ref(false)
const isCreating = ref(false)
const isLoadingDelete = ref(false)
const error = ref<string | null>(null)

function extractError(e: any, fallback: string): string {
  return e?.data?.message || e?.message || fallback
}

export const useUserBooks = () => {
  const isEmpty = computed(() => !isLoading.value && books.value.length === 0)

  const fetchBooks = async () => {
    isLoading.value = true
    error.value = null
    try {
      const data = await $fetch<UserBook[]>('/api/user/books')
      books.value = data
    } catch (e: any) {
      error.value = extractError(e, 'Falha ao carregar livros')
    } finally {
      isLoading.value = false
    }
  }

  const createBook = async (payload: CreateBookPayload): Promise<UserBook | null> => {
    isCreating.value = true
    error.value = null
    try {
      const data = await $fetch<UserBook>('/api/user/books', {
        method: 'POST',
        body: payload,
      })
      books.value.unshift(data)
      return data
    } catch (e: any) {
      error.value = extractError(e, 'Falha ao criar livro')
      return null
    } finally {
      isCreating.value = false
    }
  }

  const deleteBook = async (id: string): Promise<boolean> => {
    isLoadingDelete.value = true
    error.value = null
    try {
      await $fetch(`/api/user/books/${id}`, { method: 'DELETE' })
      books.value = books.value.filter(b => b.id !== id)
      return true
    } catch (e: any) {
      error.value = extractError(e, 'Falha ao deletar livro')
      return false
    } finally {
      isLoadingDelete.value = false
    }
  }

  return {
    books: readonly(books),
    isLoading: readonly(isLoading),
    isCreating: readonly(isCreating),
    isLoadingDelete: readonly(isLoadingDelete),
    error: readonly(error),
    isEmpty,
    fetchBooks,
    createBook,
    deleteBook,
  }
}
