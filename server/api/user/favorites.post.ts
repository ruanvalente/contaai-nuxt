import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const { bookId } = await readBody(event)

  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .maybeSingle()

  if (existing) {
    await supabase
      .from("favorites")
      .delete()
      .eq("id", (existing as { id: string }).id)

    return { favorited: false }
  }

  await supabase
    .from("favorites")
    .insert({ user_id: user.id, book_id: bookId } as never)

  return { favorited: true }
})
