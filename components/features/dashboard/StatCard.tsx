import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  valueColor?: string
  subtitle?: string
  trend?: string
  trendUp?: boolean
  progressPercentage?: number
  icon: LucideIcon
  iconBg?: string
}

export default function StatCard({
  title,
  value,
  valueColor = 'text-[#0F172A]',
  subtitle,
  trend,
  trendUp = true,
  progressPercentage,
  icon: Icon,
  iconBg = 'bg-gradient-to-br from-[#1F3864] to-[#4F46E5]',
}: StatCardProps) {
  return (
    <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(31,56,100,0.12)] hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Ambient corner glow on hover */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
          {title}
        </p>
        <div className={`w-9 h-9 rounded-xl ${iconBg} text-white flex items-center justify-center shadow-md shadow-indigo-950/10 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className={`text-[30px] font-extrabold tracking-tight ${valueColor}`}>
          {value}
        </span>
        {trend && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            trendUp ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200' : 'bg-red-50 text-[#DC2626] border border-red-200'
          }`}>
            {trend}
          </span>
        )}
        {subtitle && (
          <span className="text-[12px] text-[#64748B] font-medium">{subtitle}</span>
        )}
      </div>

      {typeof progressPercentage === 'number' && (
        <div className="mt-3">
          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#4F46E5] to-[#818CF8] h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}