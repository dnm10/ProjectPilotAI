import { ProjectReport } from '@/types'
import { API_BASE_URL } from './config'

export interface ReportWeekOption {
  weekStart: string
  label: string
  sprintName: string
}

// Fetch available sprint weeks dynamically from the backend / Supabase
export async function fetchAvailableWeeks(teamId?: string): Promise<ReportWeekOption[]> {
  try {
    const targetTeamId =
      teamId ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('projectpilot_team_id')
        : null)

    const url = targetTeamId
      ? `${API_BASE_URL}/reports/weeks?team_id=${encodeURIComponent(targetTeamId)}`
      : `${API_BASE_URL}/reports/weeks`

    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      return []
    }

    const data = await res.json()
    return data.weeks || []
  } catch (err) {
    console.warn('Could not fetch report weeks dynamically:', err)
    return []
  }
}

// Fetch the report directly from backend (from Supabase)
export async function fetchReport(
  weekStart?: string,
  version: 'technical' | 'stakeholder' = 'technical',
  teamId?: string
): Promise<ProjectReport> {
  try {
    const targetTeamId =
      teamId ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('projectpilot_team_id')
        : null)

    const queryParams = new URLSearchParams()
    if (targetTeamId) queryParams.set('team_id', targetTeamId)
    if (version) queryParams.set('version', version)
    if (weekStart) queryParams.set('week_start', weekStart)

    const res = await fetch(
      `${API_BASE_URL}/reports/latest?${queryParams.toString()}`,
      { cache: 'no-store' }
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch report: ${res.statusText}`)
    }

    const data = await res.json()
    const report = data.report

    return {
      week_start:
        report.week_start ||
        (report.created_at ? report.created_at.split('T')[0] : weekStart || ''),
      label: `Week of ${new Date(report.week_start || report.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      title:
        report.title ||
        (version === 'technical'
          ? 'Technical Sprint Health Report'
          : 'Executive Stakeholder Summary'),
      sprint_name: report.sprint_name || 'Active Sprint',
      technical_version_text:
        version === 'technical'
          ? report.content || report.technical_version_text || ''
          : report.technical_version_text || '',
      stakeholder_version_text:
        version === 'stakeholder'
          ? report.content || report.stakeholder_version_text || ''
          : report.stakeholder_version_text || '',
      key_metrics: {
        velocity_completion: report.key_metrics?.velocity_completion ?? 80,
        on_time_probability: report.key_metrics?.on_time_probability ?? 85,
        high_risk_tickets_count: report.key_metrics?.high_risk_tickets_count ?? 0,
        prs_merged_count: report.key_metrics?.prs_merged_count ?? 0,
      },
    }
  } catch (err) {
    console.error('Error fetching live report from backend:', err)
    throw err
  }
}
