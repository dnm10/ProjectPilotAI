import { useQuery } from '@tanstack/react-query'
import {
  fetchDashboardStats,
  fetchTopRisks,
  fetchWorkloadSummary,
  fetchRecentActivity,
} from '@/lib/api/dashboard'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  })
}

export function useTopRisks() {
  return useQuery({
    queryKey: ['dashboard', 'topRisks'],
    queryFn: fetchTopRisks,
  })
}

export function useWorkloadSummary() {
  return useQuery({
    queryKey: ['dashboard', 'workload'],
    queryFn: fetchWorkloadSummary,
  })
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['dashboard', 'recentActivity'],
    queryFn: fetchRecentActivity,
  })
}