import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.title) {
    throw createError({ statusCode: 400, message: "Título é obrigatório" })
  }

  if (!body.category) {
    throw createError({ statusCode: 400, message: "Categoria é obrigatória" })
  }

  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  const { data, error } = await supabase
    .from("user_books")
    .insert({
      user_id: user.id,
      title: body.title,
      author: body.author || "",
      cover_color: body.coverColor || "#8B4513",
      category: body.category,
      status: "draft",
      reading_status: "none",
      reading_progress: 0,
      word_count: 0,
    } as never)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 400, message: error.message })
  }

  return data
})
