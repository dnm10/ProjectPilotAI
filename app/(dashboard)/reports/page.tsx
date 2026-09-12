'use client'

import React from 'react'
import { useReportStore } from '@/store/useReportStore'
import { useReport, useAvailableReportWeeks } from '@/hooks/useReports'
import ReportControls from '@/components/features/reports/ReportControls'
import ReportCard from '@/components/features/reports/ReportCard'
import ReportsSkeleton from '@/components/features/reports/ReportsSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import { FileText, Sparkles, Calendar } from 'lucide-react'

export default function ReportsPage() {
  const { selectedWeek, activeAudience, setSelectedWeek } = useReportStore()

  const { data: availableWeeks = [], isLoading: isWeeksLoading } = useAvailableReportWeeks()
  const { data: report, isLoading: isReportLoading, error } = useReport(selectedWeek, activeAudience)

  const isLoading = isWeeksLoading || isReportLoading

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#1F3864] flex items-center justify-center border border-indigo-100">
              <FileText className="w-4 h-4" />
            </div>
            <span>Audience-Aware Auto Reports</span>
          </h1>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Same sprint telemetry, automatically tailored for engineering teams vs. executive stakeholders.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50/80 border border-indigo-200/70 px-3 py-1 rounded-full self-start sm:self-auto shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
          <span>AI-Synthesized Telemetry</span>
        </div>
      </div>

      {isLoading ? (
        <ReportsSkeleton />
      ) : (
        <>
          {/* Top Controls: Week Selector + Technical/Stakeholder Toggle */}
          <ReportControls availableWeeks={availableWeeks} />

          {/* Main Report Card View / Empty State */}
          {error || !report ? (
            <EmptyState
              icon={FileText}
              title="Report unavailable for this week"
              description={`No synthesis data found for ${selectedWeek}. Select another active sprint week to view tailored technical and executive summaries.`}
              actionLabel="Select Latest Week"
              onAction={() => {
                if (availableWeeks.length > 0) {
                  setSelectedWeek(availableWeeks[0].weekStart)
                }
              }}
              actionIcon={Calendar}
            />
          ) : (
            <ReportCard report={report} activeAudience={activeAudience} />
          )}
        </>
      )}
    </div>
  )
}