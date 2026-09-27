'use client'

import React, { useState } from 'react'
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/hooks/useNotifications'
import {
  Bell,
  Check,
  Trash2,
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  Filter,
  Sparkles,
  Inbox,
} from 'lucide-react'

type TabType = 'all' | 'unread' | 'risk_alert' | 'workload_warning'

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')

  const { data: notifData, isLoading } = useNotifications()
  const markReadMutation = useMarkNotificationRead()
  const markAllReadMutation = useMarkAllNotificationsRead()
  const deleteMutation = useDeleteNotification()

  const allNotifications = notifData?.notifications ?? []
  const unreadCount = notifData?.unreadCount ?? 0

  const filteredNotifications = allNotifications.filter((n) => {
    if (activeTab === 'unread') return !n.is_read
    if (activeTab === 'risk_alert') return n.type === 'risk_alert'
    if (activeTab === 'workload_warning') return n.type === 'workload_warning'
    return true
  })

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'risk_alert':
        return <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
      case 'workload_warning':
        return <Users className="w-5 h-5 text-[#A21CAF]" />
      case 'ticket_assigned':
        return <Sparkles className="w-5 h-5 text-[#4F46E5]" />
      default:
        return <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
    }
  }

  const getPriorityBadge = (score?: number) => {
    if (!score) return null
    if (score >= 0.8) {
      return (
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-[#DC2626] border border-red-200">
          HIGH PRIORITY
        </span>
      )
    }
    if (score >= 0.5) {
      return (
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-[#D97706] border border-amber-200">
          MEDIUM
        </span>
      )
    }
    return (
      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
        INFO
      </span>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1F3864] to-[#4F46E5] text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </span>
            <h1 className="text-[24px] font-extrabold text-[#0F172A] tracking-tight">
              Notifications Center
            </h1>
          </div>
          <p className="text-[13px] text-[#64748B]">
            Real-time project alerts, ML risk score changes, and workload warnings.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-60"
          >
            <Check className="w-4 h-4" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#1F3864] text-white shadow-sm'
              : 'bg-white text-[#64748B] hover:bg-slate-50 border border-[#E2E8F0]'
          }`}
        >
          All Alerts ({allNotifications.length})
        </button>

        <button
          onClick={() => setActiveTab('unread')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
            activeTab === 'unread'
              ? 'bg-[#1F3864] text-white shadow-sm'
              : 'bg-white text-[#64748B] hover:bg-slate-50 border border-[#E2E8F0]'
          }`}
        >
          Unread ({unreadCount})
        </button>

        <button
          onClick={() => setActiveTab('risk_alert')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
            activeTab === 'risk_alert'
              ? 'bg-[#DC2626] text-white shadow-sm'
              : 'bg-white text-[#64748B] hover:bg-slate-50 border border-[#E2E8F0]'
          }`}
        >
          Risk Radar Alerts
        </button>

        <button
          onClick={() => setActiveTab('workload_warning')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
            activeTab === 'workload_warning'
              ? 'bg-[#A21CAF] text-white shadow-sm'
              : 'bg-white text-[#64748B] hover:bg-slate-50 border border-[#E2E8F0]'
          }`}
        >
          Workload &amp; Burnout
        </button>
      </div>

      {/* Notifications List Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden divide-y divide-[#E2E8F0]">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-[#64748B]">
            Loading your notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#94A3B8] mx-auto flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-[15px] font-bold text-[#0F172A]">All Caught Up!</h3>
            <p className="text-[13px] text-[#64748B]">
              No notifications found for this category.
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`p-5 flex items-start gap-4 hover:bg-slate-50/80 transition-colors group ${
                !item.is_read ? 'bg-indigo-50/25' : ''
              }`}
            >
              {/* Type Icon */}
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                {getNotifIcon(item.type)}
              </div>

              {/* Body */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getPriorityBadge(item.priority_score)}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(item.created_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-[14px] font-semibold text-[#0F172A] leading-relaxed">
                  {item.message}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  {!item.is_read && (
                    <button
                      onClick={() => markReadMutation.mutate(item.id)}
                      className="text-[12px] font-semibold text-[#4F46E5] hover:text-[#4338CA] px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark as Read
                    </button>
                  )}

                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="text-[12px] font-semibold text-red-500 hover:text-red-700 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}