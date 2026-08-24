import React from 'react'
import Link from 'next/link'
import { TopRiskItem } from '@/lib/api/dashboard'
import { getRiskConfig } from '@/lib/riskColor'

interface TopRisksListProps {
  risks?: TopRiskItem[]
  loading?: boolean
}

export default function TopRisksList({ risks = [], loading }: TopRisksListProps) {
  if (loading) {
    return <div className="p-6 text-sm text-[#64748B]">Loading top risks...</div>
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-[#0F172A]">Top Risks Today</h2>
        <Link
          href="/risk"
          className="text-[12px] font-medium text-[#4F46E5] hover:text-[#4338CA]"
        >
          View all &rarr;
        </Link>
      </div>

      <div className="divide-y divide-[#E2E8F0]">
        {risks.map((item) => {
          const config = getRiskConfig(item.riskScore)

          return (
            <Link
              key={item.ticketId}
              href={`/tickets/${item.ticketId}`}
              className="block py-3.5 first:pt-0 last:pb-0 group hover:bg-slate-50/70 -mx-3 px-3 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">
                    {item.ticketId}
                  </span>
                  <span className="text-[12px] text-[#64748B]">&bull;</span>
                  <span className="text-[13px] font-medium text-[#0F172A]">
                    {item.title}
                  </span>
                </div>

                {/* Risk Pill using lib/riskColor.ts */}
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${config.badgeClass}`}
                >
                  {item.riskScore}%
                </span>
              </div>

              <p className="text-[12px] text-[#64748B] mt-1 line-clamp-1">
                {item.reason}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}