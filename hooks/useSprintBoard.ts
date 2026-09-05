import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchSprintTickets,
  updateTicketStatus,
  fetchSprints,
} from '@/lib/api/sprints'
import { Ticket, TicketStatus } from '@/types'

export function useSprintTickets(sprintId: string) {
  return useQuery({
    queryKey: ['tickets', sprintId],
    queryFn: () => fetchSprintTickets(sprintId),
  })
}

export function useUpdateTicketStatus(sprintId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      ticketId,
      newStatus,
    }: {
      ticketId: string
      newStatus: TicketStatus
    }) => updateTicketStatus(ticketId, newStatus),
    onMutate: async ({ ticketId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['tickets', sprintId] })
      const previousTickets = queryClient.getQueryData<Ticket[]>(['tickets', sprintId])

      if (previousTickets) {
        queryClient.setQueryData<Ticket[]>(
          ['tickets', sprintId],
          previousTickets.map((t) =>
            t.id === ticketId ? { ...t, status: newStatus } : t
          )
        )
      }

      return { previousTickets }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTickets) {
        queryClient.setQueryData(['tickets', sprintId], context.previousTickets)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', sprintId] })
    },
  })
}

export function useSprints() {
  return useQuery({
    queryKey: ['sprints'],
    queryFn: fetchSprints,
  })
}