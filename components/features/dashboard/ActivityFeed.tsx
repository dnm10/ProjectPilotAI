import React from 'react'
import { ActivityItem } from '@/lib/api/dashboard'
import { Activity, Clock } from 'lucide-react'

interface ActivityFeedProps {
  activities?: ActivityItem[]
  loading?: boolean
}

export default function ActivityFeed({ activities = [], loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-8 text-center text-sm text-[#64748B]">
        Loading recent telemetry...
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#818CF8] text-white flex items-center justify-center shadow-sm">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#0F172A] tracking-tight">
              Live Activity &amp; Risk Telemetry
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Real-time events from GitHub commits, Jira transitions &amp; ML models
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Live Feed
        </span>
      </div>

      <div className="space-y-3">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-[#E2E8F0] text-[13px]"
          >
            <div className="flex items-start gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-xs"
                style={{ backgroundColor: item.dotColor }}
              />
              <span className="text-[#0F172A] font-medium leading-relaxed">
                {item.text}
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#64748B] shrink-0 bg-slate-100 px-2 py-0.5 rounded-md">
              {item.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}