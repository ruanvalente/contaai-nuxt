import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { count: totalAuthors, error: authorsError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  if (authorsError) {
    throw createError({ statusCode: 500, message: authorsError.message })
  }

  const { count: totalBooks, error: booksError } = await supabase
    .from("user_books")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")

  if (booksError) {
    throw createError({ statusCode: 500, message: booksError.message })
  }

  return {
    totalAuthors: totalAuthors || 0,
    totalBooks: totalBooks || 0,
    totalReaders: 0,
    totalWords: 0,
  }
})
