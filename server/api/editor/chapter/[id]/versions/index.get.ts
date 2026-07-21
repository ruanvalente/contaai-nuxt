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

  // Verify chapter ownership
  const chapter = await (supabase.from("chapters") as any)
    .select("id, user_id")
    .eq("id", id)
    .single()

  if (chapter.error || !chapter.data) {
    throw createError({ statusCode: 404, message: "Capítulo não encontrado" })
  }

  if (chapter.data.user_id !== user.id) {
    throw createError({ statusCode: 403, message: "Sem permissão para acessar versões deste capítulo" })
  }

  // Fetch versions ordered by most recent first
  const { data: versions, error } = await (supabase.from("chapter_versions") as any)
    .select("id, chapter_id, document_id, content, label, word_count, user_id, created_at")
    .eq("chapter_id", id)
    .order("created_at", { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  // Fetch user display names for the versions
  const userIds = [...new Set((versions || []).map((v: any) => v.user_id))]
  let userNames: Record<string, string> = {}

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles" as any)
      .select("id, display_name")
      .in("id", userIds)

    if (profiles) {
      for (const p of profiles as any[]) {
        userNames[p.id] = p.display_name || "Usuário"
      }
    }
  }

  return (versions || []).map((v: any) => ({
    id: v.id,
    chapterId: v.chapter_id,
    documentId: v.document_id,
    content: v.content,
    label: v.label,
    wordCount: v.word_count,
    authorId: v.user_id,
    authorName: userNames[v.user_id] || "Usuário",
    createdAt: v.created_at,
  }))
})
