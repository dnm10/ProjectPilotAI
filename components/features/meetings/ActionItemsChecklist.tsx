'use client'

import React from 'react'
import { ActionItem } from '@/types'
import { useMeetingModalStore } from '@/store/useMeetingModalStore'
import ActionItemCard from './ActionItemCard'
import { CheckSquare, ShieldCheck } from 'lucide-react'

interface ActionItemsChecklistProps {
  actionItems: ActionItem[]
  meetingId: string
}

export default function ActionItemsChecklist({
  actionItems = [],
  meetingId,
}: ActionItemsChecklistProps) {
  const { actionItemFilter, setActionItemFilter } = useMeetingModalStore()

  // Counts
  const verifiedCount = actionItems.filter((a) => a.status === 'verified_done').length
  const flaggedCount = actionItems.filter((a) => a.status === 'flagged_incomplete').length
  const pendingCount = actionItems.filter((a) => a.status === 'pending').length

  const filteredItems = actionItems.filter((item) => {
    if (actionItemFilter === 'all') return true
    return item.status === actionItemFilter
  })

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#0F172A]">
              Closed-Loop Action Items
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Git-commit verification for audio promised items
            </p>
          </div>
        </div>

        <span className="text-[12px] font-mono font-bold text-[#0F172A] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
          {actionItems.length} Total
        </span>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
            Verified
          </span>
          <span className="text-[18px] font-extrabold text-[#16A34A]">
            {verifiedCount}
          </span>
        </div>

        <div className="bg-red-50/70 border border-red-200 rounded-xl p-2.5 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">
            Flagged
          </span>
          <span className="text-[18px] font-extrabold text-[#DC2626]">
            {flaggedCount}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
            Pending
          </span>
          <span className="text-[18px] font-extrabold text-slate-700">
            {pendingCount}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-[#E2E8F0] rounded-xl text-[11px] font-semibold">
        <button
          onClick={() => setActionItemFilter('all')}
          className={`flex-1 py-1 px-2 rounded-lg transition-all ${
            actionItemFilter === 'all'
              ? 'bg-white text-[#0F172A] shadow-xs border border-slate-200'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          All ({actionItems.length})
        </button>

        <button
          onClick={() => setActionItemFilter('verified_done')}
          className={`flex-1 py-1 px-2 rounded-lg transition-all ${
            actionItemFilter === 'verified_done'
              ? 'bg-white text-[#16A34A] shadow-xs border border-emerald-200'
              : 'text-[#64748B] hover:text-[#16A34A]'
          }`}
        >
          Done ({verifiedCount})
        </button>

        <button
          onClick={() => setActionItemFilter('flagged_incomplete')}
          className={`flex-1 py-1 px-2 rounded-lg transition-all ${
            actionItemFilter === 'flagged_incomplete'
              ? 'bg-white text-[#DC2626] shadow-xs border border-red-200'
              : 'text-[#64748B] hover:text-[#DC2626]'
          }`}
        >
          Flagged ({flaggedCount})
        </button>

        <button
          onClick={() => setActionItemFilter('pending')}
          className={`flex-1 py-1 px-2 rounded-lg transition-all ${
            actionItemFilter === 'pending'
              ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
              : 'text-[#64748B] hover:text-slate-800'
          }`}
        >
          Pending ({pendingCount})
        </button>
      </div>

      {/* List of Action Items */}
      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-0.5 custom-scrollbar">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ActionItemCard key={item.id} item={item} meetingId={meetingId} />
          ))
        ) : (
          <div className="text-center py-8 text-[#64748B] bg-slate-50/50 rounded-xl border border-dashed border-[#E2E8F0]">
            <CheckSquare className="w-6 h-6 text-[#94A3B8] mx-auto mb-2" />
            <p className="text-[13px] font-medium text-[#0F172A]">No action items found</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              No items matching filter &ldquo;{actionItemFilter}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
