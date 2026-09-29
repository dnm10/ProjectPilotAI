import { useQuery } from '@tanstack/react-query'
import { fetchReport, fetchAvailableWeeks } from '@/lib/api/reports'
import { ReportAudience } from '@/types'

export function useReport(weekStart?: string, version: ReportAudience = 'technical', teamId?: string) {
  return useQuery({
    queryKey: ['report', weekStart || 'latest', version, teamId || 'default'],
    queryFn: () => fetchReport(weekStart, version, teamId),
  })
}

export function useAvailableReportWeeks(teamId?: string) {
  return useQuery({
    queryKey: ['report-weeks', teamId || 'default'],
    queryFn: () => fetchAvailableWeeks(teamId),
  })
}
