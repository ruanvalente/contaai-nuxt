export const useAuthorFollowStore = () => {
  const following = ref<Set<string>>(new Set())
  const isLoading = ref(false)

  const isFollowing = (authorName: string) => {
    return following.value.has(authorName)
  }

  const follow = (authorName: string) => {
    following.value.add(authorName)
  }

  const unfollow = (authorName: string) => {
    following.value.delete(authorName)
  }

  return {
    isFollowing,
    follow,
    unfollow,
    isLoading: readonly(isLoading),
  }
}

export const useAuthorFollowInitialized = () => {
  // TODO: implementar carregamento inicial
}
