import { serverSupabaseClient } from "#supabase/server"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { documentId, title, content, order } = body

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

  // Verify document ownership — check if user owns this document
  const bookCheck = await (supabase.from("user_books") as any)
    .select("user_id")
    .eq("id", documentId)
    .single()

  if (bookCheck.error || !bookCheck.data || bookCheck.data.user_id !== user.id) {
    throw createError({ statusCode: 403, message: "Sem permissão para criar capítulo neste documento" })
  }

  // Calculate next order if not provided
  let nextOrder = order
  if (nextOrder === undefined || nextOrder === null) {
    const maxOrder = await (supabase.from("chapters") as any)
      .select("order")
      .eq("document_id", documentId)
      .order("order", { ascending: false })
      .limit(1)

    nextOrder = ((maxOrder.data?.[0]?.order ?? -1) + 1)
  }

  const defaultContent = { type: "doc", content: [{ type: "paragraph", content: [] }] }

  const result = await (supabase.from("chapters") as any)
    .insert({
      document_id: documentId,
      user_id: user.id,
      title: title || "Novo Capítulo",
      content: content || defaultContent,
      order: nextOrder,
    })
    .select()
    .single()

  if (result.error) {
    throw createError({ statusCode: 500, message: result.error.message })
  }

  return { success: true, chapter: result.data }
})
