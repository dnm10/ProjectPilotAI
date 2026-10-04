import { create } from 'zustand'

interface ChatDraftState {
  draftMessage: string
  setDraftMessage: (text: string) => void
  clearDraft: () => void
}

export const useChatDraftStore = create<ChatDraftState>((set) => ({
  draftMessage: '',
  setDraftMessage: (text) => set({ draftMessage: text }),
  clearDraft: () => set({ draftMessage: '' }),
}))