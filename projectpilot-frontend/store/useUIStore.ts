import { create } from 'zustand'

interface UIState {
  isSidebarOpen: boolean
  searchQuery: string
  unreadAlertsCount: number
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
  setSearchQuery: (query: string) => void
  setUnreadAlertsCount: (count: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  searchQuery: '',
  unreadAlertsCount: 5,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setUnreadAlertsCount: (count) => set({ unreadAlertsCount: count }),
}))