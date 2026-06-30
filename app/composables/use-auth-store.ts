import type { AuthUser, Profile, LoginPayload, RegisterPayload, ForgotPasswordPayload, ResetPasswordPayload } from '~/types/auth'
import { getAuthErrorMessage } from '~/types/auth'
import { loginUser, registerUser, logoutUser, sendPasswordReset, updateUserPassword } from '~/utils/supabase/auth'
import { getProfile, ensureProfile, mapSupabaseUser } from '~/utils/supabase/session'

export const useAuthStore = () => {
  const client = useSupabaseClient()
  const supabaseUser = useSupabaseUser()

  const user = ref<AuthUser | null>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => user.value !== null)

  const initialize = async () => {
    if (isInitialized.value) return
    loading.value = true
    try {
      const currentUser = supabaseUser.value
      if (currentUser) {
        const userProfile = await getProfile(client, currentUser.id ?? currentUser.sub ?? '')
        profile.value = userProfile
        user.value = mapSupabaseUser(currentUser, userProfile)
      }
    } catch {
      // session invalid or expired
    } finally {
      isInitialized.value = true
      loading.value = false
    }
  }

  const loadProfile = async () => {
    if (!user.value) return
    try {
      profile.value = await getProfile(client, user.value.id)
    } catch {
      // ignore
    }
  }

  const login = async (payload: LoginPayload) => {
    error.value = null
    loading.value = true
    try {
      const data = await loginUser(client, payload)
      const u = data.user!
      const p = await getProfile(client, u.id)
      const ensuredProfile = p ?? await ensureProfile(client, u.id, u.user_metadata?.full_name)
      profile.value = ensuredProfile
      user.value = mapSupabaseUser(u, ensuredProfile)
    } catch (e) {
      error.value = getAuthErrorMessage(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const register = async (payload: RegisterPayload) => {
    error.value = null
    loading.value = true
    try {
      const data = await registerUser(client, payload)

      if (data.session) {
        const u = data.user!
        const p = await getProfile(client, u.id)
        const ensuredProfile = p ?? await ensureProfile(client, u.id, payload.name)
        profile.value = ensuredProfile
        user.value = mapSupabaseUser(u, ensuredProfile)
      }

      return data
    } catch (e) {
      error.value = getAuthErrorMessage(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    error.value = null
    loading.value = true
    try {
      await logoutUser(client)
      user.value = null
      profile.value = null
    } catch (e) {
      error.value = getAuthErrorMessage(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const forgotPassword = async (payload: ForgotPasswordPayload) => {
    error.value = null
    loading.value = true
    try {
      await sendPasswordReset(client, payload)
    } catch (e) {
      error.value = getAuthErrorMessage(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (payload: ResetPasswordPayload) => {
    error.value = null
    loading.value = true
    try {
      await updateUserPassword(client, payload)
    } catch (e) {
      error.value = getAuthErrorMessage(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    isInitialized.value = false
    await initialize()
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user: readonly(user),
    profile: readonly(profile),
    loading: readonly(loading),
    error: readonly(error),
    isInitialized: readonly(isInitialized),
    isAuthenticated,
    initialize,
    loadProfile,
    login,
    register,
    logout,
    forgotPassword,
    updatePassword,
    refresh,
    clearError,
  }
}
