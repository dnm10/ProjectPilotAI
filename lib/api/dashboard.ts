import { API_BASE_URL } from './config'

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
  dotColor: string
}

export interface DashboardSummaryResponse {
  success: boolean
  teamName: string
  stats: DashboardStats
  topRisks: TopRiskItem[]
  workload: WorkloadItem[]
  activity: ActivityItem[]
}

function getStoredTeamId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('projectpilot_team_id')
  }
  return null
}

export async function fetchDashboardSummary(teamId?: string): Promise<DashboardSummaryResponse> {
  try {
    const targetTeamId = teamId || getStoredTeamId()
    const url = new URL(`${API_BASE_URL}/api/dashboard/summary`)
    if (targetTeamId) {
      url.searchParams.append('team_id', targetTeamId)
    }

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      teamName: data.teamName || 'Team',
      stats: data.stats || {
        sprintProgress: 0,
        highRiskCount: 0,
        releaseReadinessScore: 50,
        unreadAlertsCount: 0,
        sprintName: 'Sprint',
        sprintDayCount: 'Active Sprint',
      },
      topRisks: Array.isArray(data.topRisks) ? data.topRisks : [],
      workload: Array.isArray(data.workload) ? data.workload : [],
      activity: Array.isArray(data.activity) ? data.activity : [],
    }
  } catch (error) {
    console.warn('Failed to fetch dashboard summary from backend:', error)
    return {
      success: false,
      teamName: 'Team',
      stats: {
        sprintProgress: 0,
        highRiskCount: 0,
        releaseReadinessScore: 50,
        unreadAlertsCount: 0,
        sprintName: 'Sprint',
        sprintDayCount: 'Active Sprint',
      },
      topRisks: [],
      workload: [],
      activity: [],
    }
  }
}

export async function fetchDashboardStats(teamId?: string): Promise<DashboardStats> {
  try {
    const targetTeamId = teamId || getStoredTeamId()
    const url = new URL(`${API_BASE_URL}/api/dashboard/stats`)
    if (targetTeamId) {
      url.searchParams.append('team_id', targetTeamId)
    }

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const summary = await fetchDashboardSummary(teamId)
      return summary.stats
    }

    const data = await response.json()
    return data.stats
  } catch {
    const summary = await fetchDashboardSummary(teamId)
    return summary.stats
  }
}

export async function fetchTopRisks(teamId?: string): Promise<TopRiskItem[]> {
  try {
    const targetTeamId = teamId || getStoredTeamId()
    const url = new URL(`${API_BASE_URL}/api/dashboard/risks`)
    if (targetTeamId) {
      url.searchParams.append('team_id', targetTeamId)
    }

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const summary = await fetchDashboardSummary(teamId)
      return summary.topRisks
    }

    const data = await response.json()
    return Array.isArray(data.risks) ? data.risks : []
  } catch {
    const summary = await fetchDashboardSummary(teamId)
    return summary.topRisks
  }
}

export async function fetchWorkloadSummary(teamId?: string): Promise<WorkloadItem[]> {
  try {
    const targetTeamId = teamId || getStoredTeamId()
    const url = new URL(`${API_BASE_URL}/api/dashboard/workload`)
    if (targetTeamId) {
      url.searchParams.append('team_id', targetTeamId)
    }

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const summary = await fetchDashboardSummary(teamId)
      return summary.workload
    }

    const data = await response.json()
    return Array.isArray(data.workload) ? data.workload : []
  } catch {
    const summary = await fetchDashboardSummary(teamId)
    return summary.workload
  }
}

export async function fetchRecentActivity(teamId?: string): Promise<ActivityItem[]> {
  try {
    const targetTeamId = teamId || getStoredTeamId()
    const url = new URL(`${API_BASE_URL}/api/dashboard/activity`)
    if (targetTeamId) {
      url.searchParams.append('team_id', targetTeamId)
    }

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const summary = await fetchDashboardSummary(teamId)
      return summary.activity
    }

    const data = await response.json()
    return Array.isArray(data.activity) ? data.activity : []
  } catch {
    const summary = await fetchDashboardSummary(teamId)
    return summary.activity
  }
}
