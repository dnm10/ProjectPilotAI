import { Ticket, TicketStatus } from '@/types'
import { API_BASE_URL } from './config'

interface RawBackendTicket {
  id: string
  title: string
  description?: string | null
  status: TicketStatus
  assignee_id?: string | null
  story_points?: number | null
  priority?: 'low' | 'medium' | 'high' | 'critical'
  sprint_id: string
  created_at: string
  updated_at: string
  profiles?: {
    full_name?: string | null
    email?: string | null
  } | null
}

export async function fetchSprintTickets(
  sprintId: string
): Promise<Ticket[]> {
  if (!sprintId) {
    return []
  }

  const response = await fetch(
    `${API_BASE_URL}/api/sprints/${sprintId}/tickets`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch sprint tickets')
  }

  const data = await response.json()

  return (data.tickets || []).map((ticket: RawBackendTicket) => {
    const profile = ticket.profiles || null

    const developerName =
      profile?.full_name ||
      profile?.email ||
      'Unassigned'

    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description ?? '',
      status: ticket.status,
      assignee: {
        id: ticket.assignee_id || '',
        name: developerName,
        initials:
          developerName === 'Unassigned'
            ? 'UA'
            : developerName
                .split(' ')
                .map((part: string) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase(),
      },
      story_points: ticket.story_points ?? 0,
      priority: ticket.priority ?? 'medium',
      risk_score: 0,
      sprint_id: ticket.sprint_id,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at,
    }
  })
}

export async function updateTicketStatus(
  ticketId: string,
  newStatus: TicketStatus
): Promise<{ success: boolean; ticketId: string; newStatus: TicketStatus }> {
  const response = await fetch(
    `${API_BASE_URL}/api/tickets/${ticketId}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.message || 'Failed to update ticket status'
    )
  }

  const data = await response.json()

  return {
    success: data.success,
    ticketId: data.ticket?.id ?? ticketId,
    newStatus: data.ticket?.status ?? newStatus,
  }
}

export async function fetchSprints() {
  const response = await fetch(
    `${API_BASE_URL}/api/sprints`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch sprints')
  }

  const data = await response.json()

  return data.sprints
}

export async function deleteSprint(sprintId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/sprints/${sprintId}`,
    {
      method: 'DELETE',
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.message || 'Failed to delete sprint'
    )
  }

  return response.json()
}