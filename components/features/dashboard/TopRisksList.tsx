import React from 'react'
import Link from 'next/link'
import { TopRiskItem } from '@/lib/api/dashboard'
import { getRiskConfig } from '@/lib/riskColor'
import { ShieldAlert, ArrowUpRight } from 'lucide-react'

interface TopRisksListProps {
  risks?: TopRiskItem[]
  loading?: boolean
}

export default function TopRisksList({ risks = [], loading }: TopRisksListProps) {
  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-8 text-center text-sm text-[#64748B]">
        Loading risk radar...
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#DC2626] to-[#D97706] text-white flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#0F172A] tracking-tight">
              Top Risks Today
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Code-aware blockers ranked by ML explainability score
            </p>
          </div>
        </div>

        <Link
          href="/risk"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#4F46E5] hover:text-[#4338CA] px-3 py-1.5 rounded-lg bg-indigo-50/70 hover:bg-indigo-100/70 transition-colors"
        >
          <span>Control Room</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-[#E2E8F0]">
        {risks.map((item) => {
          const config = getRiskConfig(item.riskScore)

          return (
            <Link
              key={item.ticketId}
              href={`/tickets/${item.ticketId}`}
              className="block py-4 first:pt-0 last:pb-0 group hover:bg-slate-50/80 -mx-3 px-3 rounded-xl transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors font-mono">
                    {item.ticketId}
                  </span>
                  <span className="text-[12px] text-[#64748B]">&bull;</span>
                  <span className="text-[13px] font-semibold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">
                    {item.title}
                  </span>
                </div>

                {/* Risk Badge */}
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs ${config.badgeClass}`}
                >
                  {item.riskScore}% Risk
                </span>
              </div>

              <p className="text-[12px] text-[#64748B] mt-1.5 leading-relaxed line-clamp-1">
                {item.reason}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}