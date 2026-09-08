import { Ticket, TicketStatus } from '@/types'
import { API_BASE_URL } from './config'

const INITIAL_BOARD_TICKETS: Ticket[] = [
  {
    id: 'TICKET-140',
    title: 'User Profile Settings & Preferences',
    description: 'Allow users to update notification preferences and profile avatar.',
    status: 'todo',
    assignee: { id: 'usr-2', name: 'Rohan Verma', initials: 'RV' },
    story_points: 3,
    priority: 'low',
    risk_score: 22,
    sprint_id: 'sprint-3',
    created_at: 'Aug 14, 2026',
    updated_at: '6 hr ago',
  },
  {
    id: 'TICKET-142',
    title: 'Payment Gateway Integration',
    description: 'Integrate Stripe gateway, webhook listeners, and refund flows.',
    status: 'in_progress',
    assignee: { id: 'usr-1', name: 'Aditi Sharma', initials: 'AS' },
    story_points: 8,
    priority: 'high',
    risk_score: 78,
    risk_type: 'code_aware',
    sprint_id: 'sprint-3',
    created_at: 'Aug 14, 2026',
    updated_at: '14 min ago',
  },
  {
    id: 'TICKET-156',
    title: 'Checkout Flow Redesign',
    description: 'Multi-step cart checkout with address auto-complete.',
    status: 'in_progress',
    assignee: { id: 'usr-2', name: 'Rohan Verma', initials: 'RV' },
    story_points: 5,
    priority: 'high',
    risk_score: 71,
    risk_type: 'delay',
    sprint_id: 'sprint-3',
    created_at: 'Aug 15, 2026',
    updated_at: '32 min ago',
  },
  {
    id: 'TICKET-149',
    title: 'Push Notification Service',
    description: 'Web push notifications via service workers for urgent project risk alerts.',
    status: 'in_review',
    assignee: { id: 'usr-4', name: 'Kabir Mehta', initials: 'KM' },
    story_points: 5,
    priority: 'medium',
    risk_score: 52,
    risk_type: 'delay',
    sprint_id: 'sprint-3',
    created_at: 'Aug 16, 2026',
    updated_at: '3 hr ago',
  },
  {
    id: 'TICKET-138',
    title: 'Authentication & Session Refresh',
    description: 'Supabase JWT session token refresh and protected route middleware.',
    status: 'done',
    assignee: { id: 'usr-3', name: 'Meera Iyer', initials: 'MI' },
    story_points: 5,
    priority: 'high',
    risk_score: 18,
    sprint_id: 'sprint-3',
    created_at: 'Aug 14, 2026',
    updated_at: 'Yesterday',
  },
]

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

  return data.tickets.map((ticket: any) => ({
    id: ticket.id,
    title: ticket.title,
    description: ticket.description ?? '',
    status: ticket.status,
    assignee: {
      id: '',
      name: 'Unassigned',
      initials: 'UA',
    },
    story_points: ticket.story_points ?? 0,
    priority: ticket.priority ?? 'medium',
    risk_score: 0,
    sprint_id: ticket.sprint_id,
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
  }))
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