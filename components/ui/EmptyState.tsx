import React from 'react'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionIcon?: LucideIcon
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center shadow-xs flex flex-col items-center justify-center max-w-lg mx-auto space-y-4 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-[#E2E8F0] text-slate-400 flex items-center justify-center shadow-2xs">
        <Icon className="w-7 h-7 text-slate-500" />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-[16px] font-bold text-[#0F172A] tracking-tight">
          {title}
        </h3>
        <p className="text-[13px] text-[#64748B] leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {ActionIcon && <ActionIcon className="w-4 h-4" />}
            <span>{actionLabel}</span>
          </button>
        </div>
      )}
    </div>
  )
}
