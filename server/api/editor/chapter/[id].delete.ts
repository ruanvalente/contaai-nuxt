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

  const chapter = await (supabase.from("chapters") as any)
    .select("id, document_id, user_id")
    .eq("id", id)
    .single()

  if (chapter.error || !chapter.data) {
    throw createError({ statusCode: 404, message: "Capítulo não encontrado" })
  }

  if (chapter.data.user_id !== user.id) {
    throw createError({ statusCode: 403, message: "Sem permissão para excluir este capítulo" })
  }

  const result = await (supabase.from("chapters") as any)
    .delete()
    .eq("id", id)

  if (result.error) {
    throw createError({ statusCode: 500, message: result.error.message })
  }

  return { success: true }
})
