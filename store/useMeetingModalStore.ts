import { create } from 'zustand'
import { ActionItemStatus } from '@/types'

interface MeetingModalState {
  isUploadModalOpen: boolean
  actionItemFilter: ActionItemStatus | 'all'
  transcriptSearchQuery: string
  openUploadModal: () => void
  closeUploadModal: () => void
  setActionItemFilter: (filter: ActionItemStatus | 'all') => void
  setTranscriptSearchQuery: (query: string) => void
  resetFilters: () => void
}

export const useMeetingModalStore = create<MeetingModalState>((set) => ({
  isUploadModalOpen: false,
  actionItemFilter: 'all',
  transcriptSearchQuery: '',
  openUploadModal: () => set({ isUploadModalOpen: true }),
  closeUploadModal: () => set({ isUploadModalOpen: false }),
  setActionItemFilter: (filter) => set({ actionItemFilter: filter }),
  setTranscriptSearchQuery: (query) => set({ transcriptSearchQuery: query }),
  resetFilters: () => set({ actionItemFilter: 'all', transcriptSearchQuery: '' }),
}))
