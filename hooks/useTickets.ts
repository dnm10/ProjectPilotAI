import { useQuery } from '@tanstack/react-query'
import { fetchTicketById } from '@/lib/api/tickets'

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => fetchTicketById(id),
  })
}