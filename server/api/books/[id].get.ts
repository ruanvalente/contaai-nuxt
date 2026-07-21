import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, message: "ID do livro é obrigatório" })
  }

  if (!UUID_REGEX.test(id)) {
    throw createError({ statusCode: 400, message: "ID do livro inválido" })
  }

  const supabase = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  // Try user_books with admin client (bypass RLS)
  const { data: userBook, error: userBookError } = await supabase
    .from("user_books")
    .select("id, title, author, cover_url, cover_color, content, category, word_count, created_at, user_id, status")
    .eq("id", id)
    .single()

  if (userBookError && userBookError.code !== "PACKAGE_NOT_FOUND" && userBookError.code !== "42P01" && userBookError.code !== "PGRST116") {
    throw createError({ statusCode: 500, message: userBookError.message })
  }

  if (userBook && userBook.user_id === user?.id) {
    return {
      id: userBook.id,
      title: userBook.title,
      author: userBook.author,
      cover_url: userBook.cover_url || null,
      cover_color: userBook.cover_color || null,
      description: userBook.content || null,
      category: userBook.category || null,
      pages: userBook.word_count || 0,
      created_at: userBook.created_at,
      user_id: userBook.user_id,
    }
  }

  // Fall back to public books catalog
  const publicBook = await supabase
    .from("books")
    .select("id, title, author, cover_url, cover_color, description, category, pages, rating, rating_count, review_count, created_at")
    .eq("id", id)
    .single()

  if (publicBook.error) {
    throw createError({ statusCode: 404, message: "Livro não encontrado" })
  }

  return {
    ...publicBook.data,
    cover_url: publicBook.data.cover_url || null,
    cover_color: publicBook.data.cover_color || null,
    user_id: null,
  }
})
