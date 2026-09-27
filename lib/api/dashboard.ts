export interface DashboardStats {
  sprintProgress: number
  highRiskCount: number
  releaseReadinessScore: number
  unreadAlertsCount: number
  sprintName: string
  sprintDayCount: string
}

export interface TopRiskItem {
  ticketId: string
  title: string
  riskScore: number
  reason: string
  riskType: 'code_aware' | 'delay' | 'burnout'
}

export interface WorkloadItem {
  name: string
  percentage: number
}

export interface ActivityItem {
  id: string
  text: string
  timestamp: string
  dotColor: string // e.g. '#DC2626', '#16A34A', '#4F46E5', '#A21CAF'
}

// Typed Mock API fetchers (Ready for FastAPI integration)
export async function fetchDashboardStats(): Promise<DashboardStats> {
  return {
    sprintProgress: 64,
    highRiskCount: 3,
    releaseReadinessScore: 74,
    unreadAlertsCount: 5,
    sprintName: 'Sprint 3',
    sprintDayCount: 'Day 6 of 10',
  }
}

export async function fetchTopRisks(): Promise<TopRiskItem[]> {
  return [
    {
      ticketId: 'TICKET-142',
      title: 'Payment Gateway Integration',
      riskScore: 78,
      reason: 'No commits in 3 days · only 1 dev has touched this file · PR #212 has no tests',
      riskType: 'code_aware',
    },
    {
      ticketId: 'TICKET-156',
      title: 'Checkout Flow Redesign',
      riskScore: 71,
      reason: 'Reopened 4 times this sprint · requirements still changing',
      riskType: 'delay',
    },
    {
      ticketId: 'TICKET-149',
      title: 'Push Notification Service',
      riskScore: 52,
      reason: 'Review pending 3 days · assignee has 3 concurrent tickets',
      riskType: 'delay',
    },
  ]
}

export async function fetchWorkloadSummary(): Promise<WorkloadItem[]> {
  return [
    { name: 'Aditi', percentage: 82 },
    { name: 'Rohan', percentage: 58 },
    { name: 'Meera', percentage: 45 },
    { name: 'Kabir', percentage: 63 },
  ]
}

export async function fetchRecentActivity(): Promise<ActivityItem[]> {
  return [
    {
      id: '1',
      text: 'Closed-loop check flagged Kabir’s promised fix on TICKET-149 as incomplete',
      timestamp: '14 min ago',
      dotColor: '#DC2626', // Red
    },
    {
      id: '2',
      text: 'Burnout signal raised for Aditi (3 late-night commits this week) — visible to lead only',
      timestamp: '2 hr ago',
      dotColor: '#A21CAF', // Purple (Burnout)
    },
    {
      id: '3',
      text: 'Weekly report generated — technical and stakeholder versions ready',
      timestamp: '3 hr ago',
      dotColor: '#16A34A', // Green
    },
    {
      id: '4',
      text: 'PR #219 merged by Meera — code-aware risk score dropped to 18%',
      timestamp: '5 hr ago',
      dotColor: '#4F46E5', // Indigo
    },
  ]
}