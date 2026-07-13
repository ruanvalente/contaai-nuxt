import type { UserMetrics, PlatformMetrics } from '~/types/dashboard'

const userMetrics = ref<UserMetrics | null>(null)
const platformMetrics = ref<PlatformMetrics | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

function extractError(e: any, fallback: string): string {
  return e?.data?.message || e?.message || fallback
}

export const useDashboard = () => {
  const fetchMetrics = async () => {
    isLoading.value = true
    error.value = null
    try {
      const [user, platform] = await Promise.all([
        $fetch<UserMetrics>('/api/user/stats'),
        $fetch<PlatformMetrics>('/api/platform/stats'),
      ])
      userMetrics.value = user
      platformMetrics.value = platform
    } catch (e: any) {
      error.value = extractError(e, 'Falha ao carregar estatísticas')
    } finally {
      isLoading.value = false
    }
  }

  return {
    userMetrics: readonly(userMetrics),
    platformMetrics: readonly(platformMetrics),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchMetrics,
  }
}
