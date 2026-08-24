import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  valueColor?: string
  subtitle?: string
  progressPercentage?: number
}

export default function StatCard({
  title,
  value,
  valueColor = 'text-[#0F172A]',
  subtitle,
  progressPercentage,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
        {title}
      </p>

      <div className="mt-2 flex items-baseline justify-between">
        <span className={`text-[28px] font-bold tracking-tight ${valueColor}`}>
          {value}
        </span>
        {subtitle && (
          <span className="text-[12px] text-[#64748B]">{subtitle}</span>
        )}
      </div>

      {typeof progressPercentage === 'number' && (
        <div className="mt-3 w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#4F46E5] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
    </div>
  )
}