import { useQuery } from '@tanstack/react-query'
import {
  fetchTeamWorkload,
  fetchDeveloperDrilldown,
  fetchBurnoutSignals,
} from '@/lib/api/workload'
import { useCurrentUserRole } from '@/hooks/useTeamMembers'

export function useWorkload(teamId?: string) {
  return useQuery({
    queryKey: ['workload', teamId || 'default'],
    queryFn: () => fetchTeamWorkload(teamId),
  })
}

export function useDeveloperDrilldown(developerId: string | null) {
  return useQuery({
    queryKey: ['developer-drilldown', developerId],
    queryFn: () => fetchDeveloperDrilldown(developerId as string),
    enabled: Boolean(developerId),
  })
}

export function useBurnoutSignals(teamId?: string) {
  const { isLead } = useCurrentUserRole()

  return useQuery({
    queryKey: ['burnout-signals', teamId || 'default'],
    queryFn: () => fetchBurnoutSignals(teamId),
    enabled: isLead, // Strict RBAC: Only fetch if current active user is lead
  })
}
