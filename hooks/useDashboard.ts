import { useQuery } from '@tanstack/react-query'
import {
  fetchDashboardSummary,
  fetchDashboardStats,
  fetchTopRisks,
  fetchWorkloadSummary,
  fetchRecentActivity,
} from '@/lib/api/dashboard'

export function useDashboardSummary(teamId?: string) {
  return useQuery({
    queryKey: ['dashboard', 'summary', teamId],
    queryFn: () => fetchDashboardSummary(teamId),
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
