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

  const body = await readBody(event)

  if (!body.content) {
    throw createError({ statusCode: 400, message: "Conteúdo é obrigatório" })
  }

  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  // Get chapter with document info
  const { data: chapter, error: fetchError } = await supabase
    .from("chapters")
    .select("id, document_id")
    .eq("id", id)
    .single()

  if (fetchError || !chapter) {
    throw createError({ statusCode: 404, message: "Capítulo não encontrado" })
  }

  // Verify ownership via document
  const { data: document } = await supabase
    .from("user_books")
    .select("user_id")
    .eq("id", chapter.document_id)
    .single()

  if (!document || document.user_id !== user.id) {
    throw createError({ statusCode: 403, message: "Sem permissão para editar este capítulo" })
  }

  const { data, error } = await supabase
    .from("chapters")
    .update({
      content: body.content,
      word_count: body.wordCount || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true, chapter: data }
})