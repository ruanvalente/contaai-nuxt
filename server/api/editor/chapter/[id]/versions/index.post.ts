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

  // Verify chapter ownership
  const chapter = await (supabase.from("chapters") as any)
    .select("id, document_id, user_id")
    .eq("id", id)
    .single()

  if (chapter.error || !chapter.data) {
    throw createError({ statusCode: 404, message: "Capítulo não encontrado" })
  }

  if (chapter.data.user_id !== user.id) {
    throw createError({ statusCode: 403, message: "Sem permissão para criar versão deste capítulo" })
  }

  // Limit: max 50 versions per chapter — delete oldest if exceeded
  const { count } = await (supabase.from("chapter_versions") as any)
    .select("id", { count: "exact", head: true })
    .eq("chapter_id", id)

  if (count && count >= 50) {
    // Get oldest versions to delete
    const { data: oldest } = await (supabase.from("chapter_versions") as any)
      .select("id")
      .eq("chapter_id", id)
      .order("created_at", { ascending: true })
      .limit(count - 49)

    if (oldest && oldest.length > 0) {
      await (supabase.from("chapter_versions") as any)
        .delete()
        .in("id", oldest.map((v: any) => v.id))
    }
  }

  // Create version
  const { data: version, error } = await (supabase.from("chapter_versions") as any)
    .insert({
      chapter_id: id,
      document_id: chapter.data.document_id,
      user_id: user.id,
      content: body.content,
      label: body.label || null,
      word_count: body.wordCount || 0,
    })
    .select("id, chapter_id, document_id, content, label, word_count, user_id, created_at")
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return {
    id: version.id,
    chapterId: version.chapter_id,
    documentId: version.document_id,
    content: version.content,
    label: version.label,
    wordCount: version.word_count,
    authorId: version.user_id,
    authorName: "Você",
    createdAt: version.created_at,
  }
})
