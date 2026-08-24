import React from 'react'
import Link from 'next/link'
import { WorkloadItem } from '@/lib/api/dashboard'

interface WorkloadBarListProps {
  workloads?: WorkloadItem[]
  loading?: boolean
}

export default function WorkloadBarList({ workloads = [], loading }: WorkloadBarListProps) {
  if (loading) {
    return <div className="p-6 text-sm text-[#64748B]">Loading workload...</div>
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-[#0F172A]">Team Workload This Week</h2>
        <Link
          href="/workload"
          className="text-[12px] font-medium text-[#4F46E5] hover:text-[#4338CA]"
        >
          Details &rarr;
        </Link>
      </div>

      <div className="space-y-4">
        {workloads.map((item) => {
          // If workload > 80%, highlight bar in Red (#DC2626), else Indigo (#4F46E5)
          const isOverloaded = item.percentage > 80
          const barColor = isOverloaded ? 'bg-[#DC2626]' : 'bg-[#4F46E5]'

          return (
            <div key={item.name} className="flex items-center gap-3">
              <span className="w-16 text-[12px] font-medium text-[#0F172A] truncate">
                {item.name}
              </span>

              <div className="flex-1 bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <span className="w-10 text-right text-[12px] font-semibold text-[#64748B]">
                {item.percentage}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}