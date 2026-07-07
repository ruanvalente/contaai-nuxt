import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  const { data, error } = await supabase
    .from("user_books")
    .select("id, user_id, title, author, cover_url, cover_color, status, reading_status, reading_progress, category, word_count, created_at, updated_at, published_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
