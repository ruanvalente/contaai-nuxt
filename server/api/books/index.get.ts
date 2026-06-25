import { serverSupabaseClient } from "#supabase/server"

export default defineCachedEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase
    .from("books")
    .select("id, title, author, cover_url, cover_color, description, category, pages, rating, rating_count, review_count, created_at")

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
}, {
  maxAge: 300,
  swr: true,
})
