import { ProjectReport } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
const DEFAULT_TEAM_ID = 'a5fa2169-484d-4f54-bf6f-a2e210c7f1b6'

export interface ReportWeekOption {
  weekStart: string
  label: string
  sprintName: string
}

// Export available sprint weeks for the dropdown selector
export async function fetchAvailableWeeks(): Promise<ReportWeekOption[]> {
  return [
    {
      weekStart: '2026-09-22',
      label: 'Week of Sep 22, 2026',
      sprintName: 'Sprint 4 (Sep 15–29)',
    },
    {
      weekStart: '2026-09-15',
      label: 'Week of Sep 15, 2026',
      sprintName: 'Sprint 3 (Sep 1–15)',
    },
    {
      weekStart: '2026-09-08',
      label: 'Week of Sep 08, 2026',
      sprintName: 'Sprint 2 (Aug 15–29)',
    },
  ]
}

// Fetch the latest report directly from your Express backend
export async function fetchReport(weekStart?: string, version: 'technical' | 'stakeholder' = 'technical'): Promise<ProjectReport> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/reports/latest?team_id=${DEFAULT_TEAM_ID}&version=${version}`,
      { cache: 'no-store' }
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch report: ${res.statusText}`)
    }

    const data = await res.json()
    const report = data.report

    // Map backend schema to frontend ProjectReport interface
    return {
      week_start: report.created_at ? report.created_at.split('T')[0] : (weekStart || '2026-09-22'),
      label: `Week of ${new Date(report.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      title: report.title || (version === 'technical' ? 'Technical Sprint Health Report' : 'Executive Stakeholder Summary'),
      sprint_name: report.sprint_name || 'Active Sprint',
      technical_version_text: version === 'technical' ? (report.content || report.technical_version_text || '') : (report.technical_version_text || ''),
      stakeholder_version_text: version === 'stakeholder' ? (report.content || report.stakeholder_version_text || '') : (report.stakeholder_version_text || ''),
      key_metrics: {
        velocity_completion: report.key_metrics?.velocity_completion ?? 76,
        on_time_probability: report.key_metrics?.on_time_probability ?? 89,
        high_risk_tickets_count: report.key_metrics?.high_risk_tickets_count ?? 2,
        prs_merged_count: report.key_metrics?.prs_merged_count ?? 9,
      },
    }
  } catch (err) {
    console.error('Error fetching live report from backend:', err)
    throw err
  }
}
