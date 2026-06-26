import { serverSupabaseClient } from "#supabase/server";

export default defineCachedEventHandler(
  async (event) => {
    const {
      category,
      search,
      limit: limitStr,
      offset: offsetStr,
    } = getQuery(event);
    const limit = Math.min(
      Math.max(parseInt(limitStr as string) || 20, 1),
      100,
    );
    const offset = Math.max(parseInt(offsetStr as string) || 0, 0);

    const supabase = await serverSupabaseClient(event);

    let query = supabase
      .from("books")
      .select(
        "id, title, author, cover_url, cover_color, description, category, pages, rating, rating_count, review_count, created_at",
        { count: "exact" },
      )
      .order("created_at", { ascending: false });

    if (category && category !== "All") {
      query = query.eq("category", category as string);
    }

    if (search) {
      query = query.ilike("title", `%${search as string}%`);
    }

    const { data, error, count } = await query.range(
      offset,
      offset + limit - 1,
    );

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { items: data, total: count ?? data?.length ?? 0 };
  },
  {
    maxAge: 300,
    swr: true,
  },
);
