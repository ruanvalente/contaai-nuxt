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

  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  // Get chapter with document info
  const chapter = await (supabase.from("chapters") as any)
    .select("id, document_id, user_id")
    .eq("id", id)
    .single()

  if (chapter.error || !chapter.data) {
    throw createError({ statusCode: 404, message: "Capítulo não encontrado" })
  }

  if (chapter.data.user_id !== user.id) {
    throw createError({ statusCode: 403, message: "Sem permissão para editar este capítulo" })
  }

  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (body.content !== undefined) {
    updatePayload.content = body.content
  }
  if (body.title !== undefined) {
    updatePayload.title = body.title
  }
  if (body.wordCount !== undefined) {
    updatePayload.word_count = body.wordCount
  }

  const result = await (supabase.from("chapters") as any)
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single()

  if (result.error) {
    throw createError({ statusCode: 500, message: result.error.message })
  }

  return { success: true, chapter: result.data }
})
