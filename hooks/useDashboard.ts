import { useQuery } from '@tanstack/react-query'
import {
  fetchDashboardSummary,
  fetchDashboardStats,
  fetchTopRisks,
  fetchWorkloadSummary,
  fetchRecentActivity,
  getCachedDashboardSummary,
} from '@/lib/api/dashboard'

export function useDashboardSummary(teamId?: string) {
  const activeTeamId =
    teamId ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('projectpilot_team_id') || undefined
      : undefined)

  return useQuery({
    queryKey: ['dashboard', 'summary', activeTeamId],
    queryFn: () => fetchDashboardSummary(activeTeamId),
    placeholderData: () => getCachedDashboardSummary(activeTeamId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}

export function useDashboardStats(teamId?: string) {
  return useQuery({
    queryKey: ['dashboard', 'stats', teamId],
    queryFn: () => fetchDashboardStats(teamId),
  })
}

export function useTopRisks(teamId?: string) {
  return useQuery({
    queryKey: ['dashboard', 'topRisks', teamId],
    queryFn: () => fetchTopRisks(teamId),
  })
}

export function useWorkloadSummary(teamId?: string) {
  return useQuery({
    queryKey: ['dashboard', 'workload', teamId],
    queryFn: () => fetchWorkloadSummary(teamId),
  })
}

export function useRecentActivity(teamId?: string) {
  return useQuery({
    queryKey: ['dashboard', 'recentActivity', teamId],
    queryFn: () => fetchRecentActivity(teamId),
  })
}
