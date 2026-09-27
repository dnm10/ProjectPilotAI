'use client'

import React, { useState } from 'react'
import { useFilterStore } from '@/store/useFilterStore'
import { useAllRiskScores } from '@/hooks/useRiskOverview'
import RiskExplainPanel from '@/components/features/tickets/RiskExplainPanel'
import { getRiskConfig } from '@/lib/riskColor'
import { ShieldAlert, ChevronDown, ChevronUp, Clock } from 'lucide-react'

const FILTER_CHIPS = [
  { id: 'all', label: 'All Types' },
  { id: 'code_aware', label: 'Code-Aware' },
  { id: 'delay', label: 'Delay' },
  { id: 'sprint-3', label: 'Sprint 3 only' },
]

export default function RiskOverviewPage() {
  const { selectedRiskType, setSelectedRiskType } = useFilterStore()
  const { data: riskItems = [], isLoading } = useAllRiskScores(selectedRiskType)
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  const toggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id))
  }

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case 'code_aware':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-[#4F46E5] border border-indigo-200 px-2 py-0.5 rounded">
            Code-Aware
          </span>
        )
      case 'delay':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#0284C7] border border-blue-200 px-2 py-0.5 rounded">
            Delay
          </span>
        )
      case 'burnout':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#A21CAF] border border-purple-200 px-2 py-0.5 rounded">
            Burnout
          </span>
        )
      default:
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
            General
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Tagline */}
      <div>
        <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[#1F3864]" />
          Risk Overview
        </h1>
        <p className="text-[13px] text-[#64748B] mt-0.5">
          Every open risk across the team, ranked by severity — explainable, not a black box.
        </p>
      </div>

      {/* Filter Chips Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FILTER_CHIPS.map((chip) => {
          const isActive = selectedRiskType === chip.id

          return (
            <button
              key={chip.id}
              onClick={() => setSelectedRiskType(chip.id)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all shadow-sm ${
                isActive
                  ? 'bg-[#1F3864] text-white ring-2 ring-[#1F3864]/20'
                  : 'bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 border border-[#E2E8F0]'
              }`}
            >
              {chip.label}
            </button>
          )
        })}
      </div>

      {/* Full-Width Risk Table Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-[#64748B] text-center">Loading risk control room...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="py-3.5 px-5">Item</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Risk Score</th>
                  <th className="py-3.5 px-4">Top Reason</th>
                  <th className="py-3.5 px-4">Assignee</th>
                  <th className="py-3.5 px-4">Updated</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
                {riskItems.map((item) => {
                  const isExpanded = expandedRowId === item.id
                  const riskConfig = getRiskConfig(item.risk_score)

                  return (
                    <React.Fragment key={item.id}>
                      {/* Main Table Row */}
                      <tr
                        onClick={() => toggleRow(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        {/* Item (ID + Title) */}
                        <td className="py-4 px-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#0F172A] hover:text-[#4F46E5] transition-colors">
                              {item.id}
                            </span>
                            <span className="text-[12px] text-[#64748B] line-clamp-1">
                              {item.title}
                            </span>
                          </div>
                        </td>

                        {/* Type Tag */}
                        <td className="py-4 px-4">{getTypeBadge(item.risk_type)}</td>

                        {/* Risk Score Pill */}
                        <td className="py-4 px-4">
                          <span
                            className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${riskConfig.badgeClass}`}
                          >
                            {item.risk_score}%
                          </span>
                        </td>

                        {/* Top Reason */}
                        <td className="py-4 px-4 text-[12px] text-[#64748B] max-w-xs truncate">
                          {item.top_reason}
                        </td>

                        {/* Assignee */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#1F3864] text-white flex items-center justify-center text-[10px] font-bold">
                              {item.assignee.initials}
                            </div>
                            <span className="text-[12px] font-medium text-[#0F172A] truncate">
                              {item.assignee.name}
                            </span>
                          </div>
                        </td>

                        {/* Updated Relative Time */}
                        <td className="py-4 px-4 text-[11px] text-[#64748B] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#64748B]" />
                            <span>{item.updated_at}</span>
                          </div>
                        </td>

                        {/* Expand Chevron */}
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                            className="p-1 rounded hover:bg-slate-200 text-[#64748B]"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Inline Expanded Explain Panel Row (Reusing RiskExplainPanel) */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80">
                          <td colSpan={7} className="p-5 border-t border-[#E2E8F0]">
                            <div className="max-w-3xl">
                              <RiskExplainPanel
                                score={item.risk_score}
                                riskType={item.risk_type === 'burnout' ? 'Burnout' : 'Code-Aware'}
                                reasons={item.shap_explanation?.reasons || []}
                                isBurnout={item.risk_type === 'burnout'}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}