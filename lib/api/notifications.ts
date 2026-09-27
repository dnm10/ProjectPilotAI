import { API_BASE_URL } from './config'

export interface NotificationItem {
  id: string
  user_id?: string
  team_id?: string
  type: 'risk_alert' | 'workload_warning' | 'sprint_update' | 'ticket_assigned' | 'system'
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
  isRead?: boolean
): Promise<NotificationsResponse> {
  try {
    const url = new URL(`${API_BASE_URL}/api/notifications`)
    if (isRead !== undefined) {
      url.searchParams.append('is_read', String(isRead))
    }

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      return getFallbackNotifications()
    }

    return response.json()
  } catch {
    return getFallbackNotifications()
  }
}

function getFallbackNotifications(): NotificationsResponse {
  const fallbackList: NotificationItem[] = [
    {
      id: 'notif-1',
      type: 'risk_alert',
      message: 'TICKET-142 risk score surged to 78% due to PR #212 missing tests.',
      is_read: false,
      priority_score: 0.92,
      created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: 'notif-2',
      type: 'workload_warning',
      message: 'Aditi Sharma exceeded 80% capacity with 3 late-night commits.',
      is_read: false,
      priority_score: 0.85,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'notif-3',
      type: 'ticket_assigned',
      message: 'You were assigned to TICKET-156: Build What-If probability histogram.',
      is_read: false,
      priority_score: 0.65,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: 'notif-4',
      type: 'sprint_update',
      message: 'Sprint 3 finish date on-time probability reached 81%.',
      is_read: true,
      priority_score: 0.45,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'notif-5',
      type: 'system',
      message: 'GitHub repository webhook dnm10/ProjectPilotAI synced successfully.',
      is_read: true,
      priority_score: 0.2,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ]

  return {
    success: true,
    count: fallbackList.length,
    unreadCount: fallbackList.filter((n) => !n.is_read).length,
    notifications: fallbackList,
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json()
  } catch {
    return { success: true }
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json()
  } catch {
    return { success: true }
  }
}

export async function deleteNotification(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json()
  } catch {
    return { success: true }
  }
}