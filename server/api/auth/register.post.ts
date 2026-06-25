import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const { name, email, password } = await readBody(event)

  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  })

  if (error) {
    throw createError({ statusCode: 400, message: error.message })
  }

  return {
    user: data.user,
    session: data.session,
  }
})
