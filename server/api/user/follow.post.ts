import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const { authorName } = await readBody(event)

  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  const { data: existing } = await supabase
    .from("author_follows")
    .select("id")
    .eq("user_id", user.id)
    .eq("author_name", authorName)
    .maybeSingle()

  if (existing) {
    await supabase
      .from("author_follows")
      .delete()
      .eq("id", (existing as { id: string }).id)

    return { following: false }
  }

  await supabase
    .from("author_follows")
    .insert({ user_id: user.id, author_name: authorName } as never)

  return { following: true }
})
