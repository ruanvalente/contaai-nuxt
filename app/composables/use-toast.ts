import type { Toast } from '~/types/toast'

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const addToast = (message: string, type: Toast['type'], duration = 4000) => {
    const id = `toast-${Date.now()}`
    toasts.value.push({ id, message, type, duration })

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }

  const success = (message: string, duration?: number) => addToast(message, 'success', duration)
  const error = (message: string, duration?: number) => addToast(message, 'error', duration)
  const info = (message: string, duration?: number) => addToast(message, 'info', duration)

  return {
    toasts: readonly(toasts),
    success,
    error,
    info,
    removeToast,
  }
}
