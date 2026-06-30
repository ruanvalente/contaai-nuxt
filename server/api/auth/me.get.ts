import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: "Não autenticado" })
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  if (error && error.code !== "PGRST116") {
    throw createError({ statusCode: 500, message: error.message })
  }

  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name ?? null,
    profile: profile ?? null,
  }
})
