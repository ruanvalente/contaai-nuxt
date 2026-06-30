import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const supabase = await serverSupabaseClient(event);

  if (query.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(
      query.code as string,
    );
    if (error) {
      throw createError({ statusCode: 400, message: error.message });
    }
  }

  return sendRedirect(event, "/");
});
