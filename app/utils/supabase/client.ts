import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  const { url, key } = useRuntimeConfig().public.supabase
  const { clientOptions } = useRuntimeConfig().public.supabase

  return createBrowserClient(url, key, {
    ...clientOptions,
    isSingleton: true,
  })
}
