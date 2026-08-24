'use client'

import React from 'react'
import { Search, Bell } from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'

export default function Topbar() {
  const { searchQuery, setSearchQuery, unreadAlertsCount } = useUIStore()

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] fixed top-0 right-0 left-[220px] z-20 flex items-center justify-between px-6">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tickets, PRs, people..."
          className="w-full h-9 pl-9 pr-4 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder-[#64748B]"
        />
      </div>

      {/* Right Items: Alerts & User Profile */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button
          aria-label="Notifications"
          className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-full transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC2626] rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E2E8F0]">
          <div className="text-right">
            <p className="text-[13px] font-semibold text-[#0F172A] leading-none">Team Zenith</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">Lead Developer</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1F3864] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-[#E2E8F0]">
            TZ
          </div>
        </div>
      </div>
    </header>
  )
}