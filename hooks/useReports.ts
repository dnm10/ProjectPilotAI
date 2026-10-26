import { useQuery } from '@tanstack/react-query'
import { fetchReport, fetchAvailableWeeks } from '@/lib/api/reports'
import { ReportAudience } from '@/types'

export function useReport(weekStart: string, version?: ReportAudience) {
  return useQuery({
    queryKey: ['report', weekStart, version],
    queryFn: () => fetchReport(weekStart),
    enabled: Boolean(weekStart),
  })
}

export function useAvailableReportWeeks() {
  return useQuery({
    queryKey: ['report-weeks'],
    queryFn: fetchAvailableWeeks,
  })
}
