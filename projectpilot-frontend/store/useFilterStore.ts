import { create } from 'zustand'

interface FilterState {
  selectedAssignee: string | 'all'
  selectedRiskType: string | 'all'
  selectedSprintId: string
  setSelectedAssignee: (assignee: string | 'all') => void
  setSelectedRiskType: (riskType: string | 'all') => void
  setSelectedSprintId: (sprintId: string) => void
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedAssignee: 'all',
  selectedRiskType: 'all',
  selectedSprintId: 'sprint-3',
  setSelectedAssignee: (assignee) => set({ selectedAssignee: assignee }),
  setSelectedRiskType: (riskType) => set({ selectedRiskType: riskType }),
  setSelectedSprintId: (sprintId) => set({ selectedSprintId: sprintId }),
}))