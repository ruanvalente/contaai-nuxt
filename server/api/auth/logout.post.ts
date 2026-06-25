import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
