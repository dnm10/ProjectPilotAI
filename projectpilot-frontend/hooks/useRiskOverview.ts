import { useQuery } from '@tanstack/react-query'
import { fetchAllRiskScores } from '@/lib/api/risk'

export function useAllRiskScores(filterType: string) {
  return useQuery({
    queryKey: ['riskScores', filterType],
    queryFn: () => fetchAllRiskScores(filterType),
  })
}