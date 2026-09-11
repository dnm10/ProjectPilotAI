'use client'

import React, { useState } from 'react'
import { ActionItem, ActionItemStatus } from '@/types'
import { useUpdateActionItemStatus } from '@/hooks/useMeetings'
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  GitCommit,
  GitPullRequest,
  Check,
  ChevronDown,
  Tag,
} from 'lucide-react'
import { toast } from '@/lib/toast'

interface ActionItemCardProps {
  item: ActionItem
  meetingId: string
}

export default function ActionItemCard({ item, meetingId }: ActionItemCardProps) {
  const { mutate: updateStatus, isPending } = useUpdateActionItemStatus()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleStatusChange = (newStatus: ActionItemStatus) => {
    updateStatus({
      meetingId,
      actionItemId: item.id,
      status: newStatus,
    })
    setDropdownOpen(false)

    if (newStatus === 'verified_done') {
      toast.success('Action item marked as verified done', 'Closed-Loop Verification')
    } else if (newStatus === 'flagged_incomplete') {
      toast.error('Action item flagged as incomplete', 'Commit Follow-Through')
    } else {
      toast.info('Action item status set to pending', 'Status Updated')
    }
  }

  // Get status badge styling based on strict rules:
  // Pending: neutral
  // Verified Done: green (#16A34A)
  // Flagged Incomplete: red (#DC2626)
  const getStatusBadge = () => {
    switch (item.status) {
      case 'verified_done':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-xs">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified Done</span>
          </span>
        )
      case 'flagged_incomplete':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full shadow-xs">
            <AlertCircle className="w-3 h-3" />
            <span>Flagged Incomplete</span>
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full shadow-xs">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Pending</span>
          </span>
        )
    }
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 ${
        item.status === 'flagged_incomplete'
          ? 'bg-red-50/20 border-red-200/90 shadow-xs'
          : item.status === 'verified_done'
          ? 'bg-white border-[#E2E8F0] shadow-xs'
          : 'bg-white border-[#E2E8F0]'
      }`}
    >
      {/* Top Header: Owner Initials + Name + Due Date + Status Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {/* Owner Initials Avatar */}
          <div className="w-7 h-7 rounded-full bg-[#1F3864] text-white text-[11px] font-bold flex items-center justify-center shadow-xs shrink-0">
            {item.owner_initials || '??'}
          </div>
          <div>
            <span className="text-[13px] font-bold text-[#0F172A] block leading-tight">
              {item.owner_name}
            </span>
            <span className="text-[11px] text-[#64748B] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#94A3B8]" />
              <span>Due {item.due_date}</span>
            </span>
          </div>
        </div>

        {/* Status Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={isPending}
            className="flex items-center gap-1 cursor-pointer hover:opacity-85 transition-opacity"
            title="Click to change status"
          >
            {getStatusBadge()}
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-20 py-1 text-[12px] animate-in fade-in duration-100">
              <button
                onClick={() => handleStatusChange('verified_done')}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-emerald-50 text-emerald-700 font-medium"
              >
                <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Mark Verified Done</span>
              </button>
              <button
                onClick={() => handleStatusChange('pending')}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-700 font-medium"
              >
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Mark Pending</span>
              </button>
              <button
                onClick={() => handleStatusChange('flagged_incomplete')}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-red-50 text-[#DC2626] font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Flag Incomplete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] text-[#334155] font-medium mt-2.5 leading-snug">
        {item.description}
      </p>

      {/* Ticket Tag if linked */}
      {item.ticket_id && (
        <div className="mt-2 flex items-center gap-1 text-[11px] font-mono text-[#4F46E5] font-semibold">
          <Tag className="w-3 h-3 text-[#4F46E5]" />
          <span>{item.ticket_id}</span>
        </div>
      )}

      {/* Closed-Loop Verification Details Banner */}
      {item.verification_note && (
        <div
          className={`mt-3 p-2.5 rounded-lg text-[11px] flex items-start gap-2 ${
            item.status === 'verified_done'
              ? 'bg-emerald-50/70 border border-emerald-200 text-emerald-800'
              : item.status === 'flagged_incomplete'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-slate-50 border border-slate-200 text-[#64748B]'
          }`}
        >
          {item.commit_hash ? (
            <GitCommit className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
          ) : item.status === 'flagged_incomplete' ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#DC2626]" />
          ) : (
            <GitPullRequest className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-500" />
          )}

          <div className="space-y-0.5">
            <span className="font-semibold block">{item.verification_note}</span>
            {item.commit_message && (
              <span className="font-mono text-[10px] text-[#64748B] block">
                &ldquo;{item.commit_message}&rdquo;
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
