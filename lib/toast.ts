import { useToastStore, ToastType } from '@/store/useToastStore'

export const toast = {
  success: (message: string, title?: string, duration?: number) => {
    useToastStore.getState().addToast({
      message,
      title,
      type: 'success',
      duration,
    })
  },
  error: (message: string, title?: string, duration?: number) => {
    useToastStore.getState().addToast({
      message,
      title,
      type: 'error',
      duration,
    })
  },
  info: (message: string, title?: string, duration?: number) => {
    useToastStore.getState().addToast({
      message,
      title,
      type: 'info',
      duration,
    })
  },
  show: (message: string, type: ToastType = 'info', title?: string, duration?: number) => {
    useToastStore.getState().addToast({
      message,
      title,
      type,
      duration,
    })
  },
}
