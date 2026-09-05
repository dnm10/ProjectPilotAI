import { create } from 'zustand'
import { ReportAudience } from '@/types'

interface ReportState {
  selectedWeek: string
  activeAudience: ReportAudience
  setSelectedWeek: (week: string) => void
  setActiveAudience: (audience: ReportAudience) => void
}

export const useReportStore = create<ReportState>((set) => ({
  selectedWeek: '2026-08-19',
  activeAudience: 'technical',
  setSelectedWeek: (week) => set({ selectedWeek: week }),
  setActiveAudience: (audience) => set({ activeAudience: audience }),
}))
