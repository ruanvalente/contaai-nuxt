import { createServerClient, parseCookieHeader, type CookieOptions } from "@supabase/ssr"
import { getHeader, setCookie, setHeader } from "h3"
import type { H3Event } from "h3"

export const createServerSupabaseClient = (event: H3Event) => {
  const { url, key, cookiePrefix, cookieOptions, clientOptions } = useRuntimeConfig(event).public.supabase

  return createServerClient(url, key, {
    ...clientOptions,
    cookies: {
      getAll: () => parseCookieHeader(getHeader(event, "Cookie") ?? ""),
      setAll: (cookies: { name: string; value: string; options: CookieOptions }[], headers: Record<string, string>) => {
        for (const { name, value, options } of cookies) {
          setCookie(event, name, value, options)
        }
        if (headers) {
          for (const [headerKey, headerValue] of Object.entries(headers)) {
            setHeader(event, headerKey, headerValue)
          }
        }
      },
    },
    cookieOptions: {
      ...cookieOptions,
      name: cookiePrefix,
    },
  })
}
