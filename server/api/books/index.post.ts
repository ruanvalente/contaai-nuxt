import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  const { data, error } = await supabase
    .from("books")
    .insert({
      title: body.title,
      author: body.author,
      description: body.description,
      category: body.category,
      pages: body.pages,
      cover_color: body.coverColor,
      user_id: user.id,
    } as never)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 400, message: error.message })
  }

  return data
})
