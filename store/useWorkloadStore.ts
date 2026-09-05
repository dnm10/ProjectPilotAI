import { create } from 'zustand'

interface WorkloadState {
  selectedDeveloperId: string | null
  isDrilldownModalOpen: boolean
  openDrilldown: (developerId: string) => void
  closeDrilldown: () => void
}

export const useWorkloadStore = create<WorkloadState>((set) => ({
  selectedDeveloperId: null,
  isDrilldownModalOpen: false,

  openDrilldown: (developerId: string) =>
    set({
      selectedDeveloperId: developerId,
      isDrilldownModalOpen: true,
    }),

  closeDrilldown: () =>
    set({
      selectedDeveloperId: null,
      isDrilldownModalOpen: false,
    }),
}))
