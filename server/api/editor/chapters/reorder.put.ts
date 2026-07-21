import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { chapterIds, documentId } = body

  if (!chapterIds || !Array.isArray(chapterIds) || chapterIds.length === 0) {
    throw createError({ statusCode: 400, message: "chapterIds é obrigatório" })
  }

  if (!documentId) {
    throw createError({ statusCode: 400, message: "documentId é obrigatório" })
  }

  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  // Verify ownership via chapters table, fallback to user_books for empty documents
  const chapterCheck = await (supabase.from("chapters") as any)
    .select("user_id")
    .eq("document_id", documentId)
    .limit(1)

  if (chapterCheck.error) {
    throw createError({ statusCode: 500, message: chapterCheck.error.message })
  }

  let ownerId = chapterCheck.data?.[0]?.user_id
  if (!ownerId) {
    const bookCheck = await (supabase.from("user_books") as any)
      .select("user_id")
      .eq("id", documentId)
      .single()
    ownerId = bookCheck.data?.user_id
  }
  if (!ownerId || ownerId !== user.id) {
    throw createError({ statusCode: 403, message: "Sem permissão para reordenar capítulos" })
  }

  // Update each chapter's order in parallel
  const updates = chapterIds.map((id: string, index: number) =>
    (supabase.from("chapters") as any)
      .update({ order: index })
      .eq("id", id)
      .eq("document_id", documentId)
  )

  const results = await Promise.all(updates)
  const error = results.find((r) => r.error)
  if (error) {
    throw createError({ statusCode: 500, message: error.error.message })
  }

  return { success: true }
})
