import { serverSupabaseClient } from "#supabase/server"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const documentId = query.documentId as string

  if (!documentId) {
    throw createError({ statusCode: 400, message: "documentId é obrigatório" })
  }

  if (!UUID_REGEX.test(documentId)) {
    throw createError({ statusCode: 400, message: "documentId inválido" })
  }

  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  // Verify document ownership
  const { data: document } = await supabase
    .from("user_books")
    .select("user_id")
    .eq("id", documentId)
    .single()

  if (!document || document.user_id !== user.id) {
    throw createError({ statusCode: 403, message: "Sem permissão para acessar este documento" })
  }

  const { data: chapters, error } = await supabase
    .from("chapters")
    .select(`
      id,
      document_id,
      title,
      "order",
      word_count,
      created_at,
      updated_at
    `)
    .eq("document_id", documentId)
    .order("order", { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return chapters || []
})