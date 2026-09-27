import React from 'react'
import Link from 'next/link'
import { WorkloadItem } from '@/lib/api/dashboard'
import { Users, ArrowUpRight } from 'lucide-react'

interface WorkloadBarListProps {
  workloads?: WorkloadItem[]
  loading?: boolean
}

export default function WorkloadBarList({ workloads = [], loading }: WorkloadBarListProps) {
  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-8 text-center text-sm text-[#64748B]">
        Loading workload...
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1F3864] to-[#2F5496] text-white flex items-center justify-center shadow-sm">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#0F172A] tracking-tight">
              Team Workload
            </h2>
            <p className="text-[11px] text-[#64748B]">Sprint 3 capacity allocation</p>
          </div>
        </div>

        <Link
          href="/workload"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#4F46E5] hover:text-[#4338CA] px-3 py-1.5 rounded-lg bg-indigo-50/70 hover:bg-indigo-100/70 transition-colors"
        >
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {workloads.map((item) => {
          const isOverloaded = item.percentage > 80
          const barColor = isOverloaded
            ? 'bg-gradient-to-r from-[#DC2626] to-[#EF4444]'
            : 'bg-gradient-to-r from-[#1F3864] to-[#4F46E5]'

          return (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-semibold text-[#0F172A]">{item.name}</span>
                <span
                  className={`font-bold ${
                    isOverloaded ? 'text-[#DC2626]' : 'text-[#64748B]'
                  }`}
                >
                  {item.percentage}%
                </span>
              </div>

              <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}