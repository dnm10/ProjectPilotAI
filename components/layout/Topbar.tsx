'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/hooks/useNotifications'
import {
  Bell,
  Search,
  Check,
  Trash2,
  ShieldAlert,
  Users,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

function getTopbarNotifIcon(type: string) {
  const t = (type || '').toLowerCase()
  if (t.includes('risk') || t.includes('scope') || t.includes('blocker')) {
    return <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
  }
  if (t.includes('workload') || t.includes('burnout') || t.includes('fatigue')) {
    return <Users className="w-4 h-4 text-[#A21CAF]" />
  }
  if (t.includes('ticket') || t.includes('sprint') || t.includes('deadline')) {
    return <Sparkles className="w-4 h-4 text-[#4F46E5]" />
  }
  return <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
}

function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export default function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: notifData, isLoading } = useNotifications()
  const markReadMutation = useMarkNotificationRead()
  const markAllReadMutation = useMarkAllNotificationsRead()
  const deleteMutation = useDeleteNotification()

  const unreadCount = notifData?.unreadCount ?? 0
  const notifications = useMemo(() => notifData?.notifications ?? [], [notifData])
  const dropdownNotifications = useMemo(() => notifications.slice(0, 5), [notifications])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-16 fixed top-0 left-[220px] right-0 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-8 flex items-center justify-between z-20 select-none shadow-xs">
      {/* Search Input */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search tickets, PRs, risks..."
          className="w-full h-9 pl-9 pr-4 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:bg-white transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-9 h-9 rounded-xl border border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-[#0F172A]">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-extrabold bg-red-100 text-[#DC2626] px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllReadMutation.mutate()}
                      className="text-[11px] font-semibold text-[#4F46E5] hover:text-[#4338CA] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      Mark read
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Items */}
              <div
                className="max-h-[340px] overflow-y-auto divide-y divide-[#E2E8F0] overscroll-contain scroll-smooth"
                onWheel={(e) => {
                  e.stopPropagation()
                }}
              >
                {isLoading ? (
                  <div className="p-8 text-center text-xs text-[#64748B]">
                    Loading...
                  </div>
                ) : dropdownNotifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#64748B]">
                    No notifications.
                  </div>
                ) : (
                  dropdownNotifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors group ${
                        !item.is_read ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                        {getTopbarNotifIcon(item.type)}
                      </div>

                      <div className="flex-1 space-y-1">
                        <p className="text-[12.5px] text-[#0F172A] font-medium leading-snug">
                          {item.message}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                          <span>{formatTime(item.created_at)}</span>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!item.is_read && (
                              <button
                                type="button"
                                onClick={() => markReadMutation.mutate(item.id)}
                                className="text-[#4F46E5] hover:text-[#4338CA] p-1 rounded cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteMutation.mutate(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* View All Footer */}
              <Link
                href="/notifications"
                onClick={() => setIsDropdownOpen(false)}
                className="block p-3 text-center text-[12px] font-bold text-[#4F46E5] hover:bg-slate-50 border-t border-[#E2E8F0] transition-colors"
              >
                View All in Notifications Center &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1F3864] to-[#4F46E5] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            TZ
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#0F172A] leading-tight">
              Team Zenith
            </span>
            <span className="text-[11px] text-[#64748B] font-medium leading-none">
              Lead Developer
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}