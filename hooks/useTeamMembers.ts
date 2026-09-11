import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTeamMembers, updateTeamMemberRole } from '@/lib/api/team'
import { useSettingsStore } from '@/store/useSettingsStore'

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: fetchTeamMembers,
  })
}

export function useUpdateTeamMemberRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      memberId,
      newRole,
    }: {
      memberId: string
      newRole: 'lead' | 'member'
    }) => updateTeamMemberRole(memberId, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] })
    },
  })
}

export function useCurrentUserRole() {
  const currentUserRole = useSettingsStore((state) => state.currentUserRole)
  const setCurrentUserRole = useSettingsStore((state) => state.setCurrentUserRole)
  const toggleCurrentUserRole = useSettingsStore((state) => state.toggleCurrentUserRole)

  return {
    role: currentUserRole,
    isLead: currentUserRole === 'lead',
    setRole: setCurrentUserRole,
    toggleRole: toggleCurrentUserRole,
  }
}
