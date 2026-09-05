import { create } from 'zustand'
import { TeamMember } from '@/types'

interface SettingsState {
  // Modal visibility states
  isGitHubModalOpen: boolean
  isJiraModalOpen: boolean
  isEditRoleModalOpen: boolean
  editingMember: TeamMember | null

  // Active user role for RBAC testing / simulation
  currentUserRole: 'lead' | 'member'

  // Actions
  openGitHubModal: () => void
  closeGitHubModal: () => void
  openJiraModal: () => void
  closeJiraModal: () => void
  openEditRoleModal: (member: TeamMember) => void
  closeEditRoleModal: () => void
  setCurrentUserRole: (role: 'lead' | 'member') => void
  toggleCurrentUserRole: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isGitHubModalOpen: false,
  isJiraModalOpen: false,
  isEditRoleModalOpen: false,
  editingMember: null,
  currentUserRole: 'lead',

  openGitHubModal: () => set({ isGitHubModalOpen: true }),
  closeGitHubModal: () => set({ isGitHubModalOpen: false }),

  openJiraModal: () => set({ isJiraModalOpen: true }),
  closeJiraModal: () => set({ isJiraModalOpen: false }),

  openEditRoleModal: (member) =>
    set({ isEditRoleModalOpen: true, editingMember: member }),
  closeEditRoleModal: () =>
    set({ isEditRoleModalOpen: false, editingMember: null }),

  setCurrentUserRole: (role) => set({ currentUserRole: role }),
  toggleCurrentUserRole: () =>
    set((state) => ({
      currentUserRole: state.currentUserRole === 'lead' ? 'member' : 'lead',
    })),
}))
