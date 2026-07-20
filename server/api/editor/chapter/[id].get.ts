import { serverSupabaseClient } from "#supabase/server"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, message: "ID do capítulo é obrigatório" })
  }

  if (!UUID_REGEX.test(id)) {
    throw createError({ statusCode: 400, message: "ID do capítulo inválido" })
  }

  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  const { data: chapter, error } = await supabase
    .from("chapters")
    .select(`
      id,
      document_id,
      title,
      content,
      "order",
      word_count,
      created_at,
      updated_at
    `)
    .eq("id", id)
    .single()

  if (error || !chapter) {
    throw createError({ statusCode: 404, message: "Capítulo não encontrado" })
  }

  // Verify ownership via document
  const { data: document } = await supabase
    .from("user_books")
    .select("user_id")
    .eq("id", chapter.document_id)
    .single()

  if (!document || document.user_id !== user.id) {
    throw createError({ statusCode: 403, message: "Sem permissão para acessar este capítulo" })
  }

  return chapter
})