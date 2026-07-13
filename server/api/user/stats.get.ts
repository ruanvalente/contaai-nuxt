import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  const { data: books, error } = await supabase
    .from("user_books")
    .select("status, word_count")
    .eq("user_id", user.id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  const rows = (books || []) as { status: string; word_count: number }[]
  const totalBooks = rows.length
  const publishedBooks = rows.filter(b => b.status === "published").length
  const drafts = rows.filter(b => b.status === "draft").length
  const totalWords = rows.reduce((sum, b) => sum + (b.word_count || 0), 0)

  return {
    totalBooks,
    publishedBooks,
    drafts,
    totalReads: 0,
    totalWords,
    avgRating: 0,
  }
})
