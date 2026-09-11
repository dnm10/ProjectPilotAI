import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMeetings,
  fetchMeetingById,
  uploadMeetingAudio,
  updateActionItemStatus,
} from '@/lib/api/meetings'
import { ActionItemStatus } from '@/types'

export function useMeetings() {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: fetchMeetings,
  })
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: ['meeting', id],
    queryFn: () => fetchMeetingById(id),
    enabled: Boolean(id),
  })
}

export function useUploadRecording() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => uploadMeetingAudio(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
    },
  })
}

export function useUpdateActionItemStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      meetingId,
      actionItemId,
      status,
    }: {
      meetingId: string
      actionItemId: string
      status: ActionItemStatus
    }) => updateActionItemStatus(meetingId, actionItemId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meeting', variables.meetingId] })
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
    },
  })
}
