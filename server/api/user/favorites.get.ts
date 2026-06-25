import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("book_id")
    .eq("user_id", user.id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data.map((f: { book_id: string }) => f.book_id)
})
