import { API_BASE_URL } from './config'

export interface NotificationItem {
  id: string
  user_id?: string
  team_id?: string
  type: string
  message: string
  related_entity_type?: string
  related_entity_id?: string
  priority_score?: number
  is_read: boolean
  created_at: string
}

export interface NotificationsResponse {
  success: boolean
  count: number
  unreadCount: number
  notifications: NotificationItem[]
}

export async function fetchNotifications(
  isRead?: boolean,
  teamId?: string
): Promise<NotificationsResponse> {
  try {
    const targetTeamId =
      teamId ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('projectpilot_team_id')
        : null)

    const url = new URL(`${API_BASE_URL}/api/notifications`)
    if (isRead !== undefined) {
      url.searchParams.append('is_read', String(isRead))
    }
    if (targetTeamId) {
      url.searchParams.append('team_id', targetTeamId)
    }

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      return { success: false, count: 0, unreadCount: 0, notifications: [] }
    }

    const data = await response.json()
    const list: NotificationItem[] = Array.isArray(data.notifications)
      ? data.notifications
      : []

    const unread = list.filter((n) => !n.is_read).length

    return {
      success: true,
      count: list.length,
      unreadCount:
        typeof data.unreadCount === 'number' ? data.unreadCount : unread,
      notifications: list,
    }
  } catch (error) {
    console.warn('Failed to fetch live notifications:', error)
    return {
      success: false,
      count: 0,
      unreadCount: 0,
      notifications: [],
    }
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${id}/read`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    return response.json()
  } catch {
    return { success: true }
  }
}

export async function markAllNotificationsAsRead(
  userId?: string,
  teamId?: string
) {
  try {
    const targetTeamId =
      teamId ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('projectpilot_team_id')
        : null)

    const response = await fetch(
      `${API_BASE_URL}/api/notifications/read-all`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, team_id: targetTeamId }),
      }
    )
    return response.json()
  } catch {
    return { success: true }
  }
}

export async function deleteNotification(id: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${id}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    return response.json()
  } catch {
    return { success: true }
  }
}
