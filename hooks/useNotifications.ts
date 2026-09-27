import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  NotificationsResponse,
} from '@/lib/api/notifications'

export function useNotifications(isRead?: boolean) {
  return useQuery({
    queryKey: ['notifications', isRead],
    queryFn: () => fetchNotifications(isRead),
    refetchInterval: 30000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previousData = queryClient.getQueryData<NotificationsResponse>(['notifications', undefined])

      if (previousData) {
        const updatedList = previousData.notifications.map((item) =>
          item.id === id ? { ...item, is_read: true } : item
        )
        queryClient.setQueryData<NotificationsResponse>(['notifications', undefined], {
          ...previousData,
          unreadCount: Math.max(0, updatedList.filter((n) => !n.is_read).length),
          notifications: updatedList,
        })
      }

      return { previousData }
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['notifications', undefined], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params?: { userId?: string; teamId?: string }) =>
      markAllNotificationsAsRead(params?.userId, params?.teamId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previousData = queryClient.getQueryData<NotificationsResponse>(['notifications', undefined])

      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: ['notifications'] },
        (old) => {
          if (!old) return old
          const updatedList = old.notifications.map((item) => ({
            ...item,
            is_read: true,
          }))
          return {
            ...old,
            unreadCount: 0,
            notifications: updatedList,
          }
        }
      )

      return { previousData }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['notifications', undefined], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previousData = queryClient.getQueryData<NotificationsResponse>(['notifications', undefined])

      if (previousData) {
        const updatedList = previousData.notifications.filter((item) => item.id !== id)
        queryClient.setQueryData<NotificationsResponse>(['notifications', undefined], {
          ...previousData,
          count: updatedList.length,
          unreadCount: updatedList.filter((n) => !n.is_read).length,
          notifications: updatedList,
        })
      }

      return { previousData }
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['notifications', undefined], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}