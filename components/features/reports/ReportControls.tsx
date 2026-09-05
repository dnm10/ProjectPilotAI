'use client'

import React from 'react'
import { useReportStore } from '@/store/useReportStore'
import { ReportWeekOption } from '@/lib/api/reports'
import { Calendar, Code, Briefcase, ChevronDown } from 'lucide-react'

interface ReportControlsProps {
  availableWeeks: ReportWeekOption[]
}

export default function ReportControls({ availableWeeks = [] }: ReportControlsProps) {
  const { selectedWeek, activeAudience, setSelectedWeek, setActiveAudience } = useReportStore()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-4 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)]">
      {/* Week Selector Dropdown */}
      <div className="flex items-center gap-3">
        <div className="relative inline-block min-w-[240px]">
          <label htmlFor="week-select" className="sr-only">
            Select Week
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4F46E5]">
            <Calendar className="w-4 h-4" />
          </div>
          <select
            id="week-select"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="w-full appearance-none bg-slate-50/80 hover:bg-slate-100/80 border border-[#E2E8F0] text-[#0F172A] text-[13px] font-semibold rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] cursor-pointer transition-all"
          >
            {availableWeeks.map((w) => (
              <option key={w.weekStart} value={w.weekStart} className="text-[#0F172A] py-1">
                {w.label} ({w.sprintName})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#64748B]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Audience Tabs Toggle */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-[#E2E8F0] self-start sm:self-auto">
        <button
          type="button"
          onClick={() => setActiveAudience('technical')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
            activeAudience === 'technical'
              ? 'bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]/80'
              : 'text-[#64748B] hover:text-[#0F172A] font-medium'
          }`}
        >
          <Code className={`w-3.5 h-3.5 ${activeAudience === 'technical' ? 'text-[#4F46E5]' : 'text-[#64748B]'}`} />
          <span>Technical View</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAudience('stakeholder')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
            activeAudience === 'stakeholder'
              ? 'bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]/80'
              : 'text-[#64748B] hover:text-[#0F172A] font-medium'
          }`}
        >
          <Briefcase className={`w-3.5 h-3.5 ${activeAudience === 'stakeholder' ? 'text-[#4F46E5]' : 'text-[#64748B]'}`} />
          <span>Stakeholder View</span>
        </button>
      </div>
    </div>
  )
}
