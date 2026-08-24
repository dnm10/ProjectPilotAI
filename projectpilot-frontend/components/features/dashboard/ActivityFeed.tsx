import React from 'react'
import { ActivityItem } from '@/lib/api/dashboard'

interface ActivityFeedProps {
  activities?: ActivityItem[]
  loading?: boolean
}

export default function ActivityFeed({ activities = [], loading }: ActivityFeedProps) {
  if (loading) {
    return <div className="p-6 text-sm text-[#64748B]">Loading activity...</div>
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
      <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Recent Activity</h2>

      <div className="space-y-3">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 text-[13px]">
            <div className="flex items-start gap-2.5">
              <span
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: item.dotColor }}
              />
              <span className="text-[#0F172A] leading-relaxed">{item.text}</span>
            </div>
            <span className="text-[11px] text-[#64748B] shrink-0">{item.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  )
}