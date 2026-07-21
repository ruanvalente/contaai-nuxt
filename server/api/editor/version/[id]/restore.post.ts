import { serverSupabaseClient } from "#supabase/server"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, message: "ID da versão é obrigatório" })
  }

  if (!UUID_REGEX.test(id)) {
    throw createError({ statusCode: 400, message: "ID da versão inválido" })
  }

  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  // Fetch the version
  const { data: version, error: versionError } = await (supabase.from("chapter_versions") as any)
    .select("id, chapter_id, content, user_id")
    .eq("id", id)
    .single()

  if (versionError || !version) {
    throw createError({ statusCode: 404, message: "Versão não encontrada" })
  }

  if (version.user_id !== user.id) {
    throw createError({ statusCode: 403, message: "Sem permissão para restaurar esta versão" })
  }

  // Get chapter to verify ownership
  const { data: chapter, error: chapterError } = await (supabase.from("chapters") as any)
    .select("id, user_id")
    .eq("id", version.chapter_id)
    .single()

  if (chapterError || !chapter) {
    throw createError({ statusCode: 404, message: "Capítulo não encontrado" })
  }

  if (chapter.user_id !== user.id) {
    throw createError({ statusCode: 403, message: "Sem permissão para editar este capítulo" })
  }

  // Calculate word count from content
  function extractWordCount(content: any): number {
    if (!content?.content) return 0
    const texts: string[] = []
    function traverse(node: any) {
      if (node.text) texts.push(node.text)
      if (node.content && Array.isArray(node.content)) node.content.forEach(traverse)
    }
    content.content.forEach(traverse)
    return texts.join(" ").trim().split(/\s+/).filter((w: string) => w.length > 0).length
  }

  // Restore chapter content
  const { error: updateError } = await (supabase.from("chapters") as any)
    .update({
      content: version.content,
      word_count: extractWordCount(version.content),
      updated_at: new Date().toISOString(),
    })
    .eq("id", version.chapter_id)

  if (updateError) {
    throw createError({ statusCode: 500, message: updateError.message })
  }

  return {
    success: true,
    chapterId: version.chapter_id,
    content: version.content,
  }
})
