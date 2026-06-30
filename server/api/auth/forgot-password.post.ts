import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  const supabase = await serverSupabaseClient(event)

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getRequestURL(event).origin}/auth/reset-password`,
  })

  if (error) {
    throw createError({ statusCode: 400, message: error.message })
  }

  return { success: true }
})
