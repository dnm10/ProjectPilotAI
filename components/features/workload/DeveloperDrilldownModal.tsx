'use client'

import React, { useEffect } from 'react'
import { useWorkloadStore } from '@/store/useWorkloadStore'
import { useDeveloperDrilldown } from '@/hooks/useWorkload'
import {
  X,
  GitCommit,
  Clock,
  GitPullRequest,
  CheckCircle2,
  Loader2,
  GitBranch,
  Zap,
  TrendingUp,
} from 'lucide-react'

export default function DeveloperDrilldownModal() {
  const { selectedDeveloperId, isDrilldownModalOpen, closeDrilldown } =
    useWorkloadStore()
  const { data: drilldownData, isLoading } =
    useDeveloperDrilldown(selectedDeveloperId)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrilldownModalOpen) {
        closeDrilldown()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDrilldownModalOpen, closeDrilldown])

  if (!isDrilldownModalOpen || !selectedDeveloperId) return null

  const workload = drilldownData?.workload
  const commits = drilldownData?.commits || []
  const prTurnaround = drilldownData?.prTurnaround
  const isOverloaded = (workload?.workload_percentage ?? 0) > 80

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] text-white shadow-xs ${
                isOverloaded ? 'bg-red-600' : 'bg-[#1F3864]'
              }`}
            >
              {workload?.initials || 'DV'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#0F172A]">
                  {workload?.name || 'Developer Details'}
                </h3>
                <span className="text-[11px] font-semibold text-[#64748B] bg-slate-200/70 px-2 py-0.5 rounded-md">
                  {workload?.role}
                </span>
              </div>
              <p className="text-[12px] text-[#64748B]">{workload?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDrilldown}
            className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#64748B]">
              <Loader2 className="w-7 h-7 animate-spin text-[#4F46E5]" />
              <p className="text-[13px]">Loading developer telemetry &amp; commit stream...</p>
            </div>
          ) : (
            <>
              {/* Capacity Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  isOverloaded
                    ? 'bg-red-50/50 border-red-200 text-red-900'
                    : 'bg-indigo-50/40 border-indigo-100 text-slate-900'
                }`}
              >
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Current Sprint Allocation
                  </p>
                  <p className="text-[18px] font-extrabold mt-0.5 flex items-center gap-2">
                    <span className={isOverloaded ? 'text-[#DC2626]' : 'text-[#4F46E5]'}>
                      {workload?.workload_percentage}% Capacity
                    </span>
                    <span className="text-[13px] font-normal text-[#64748B]">
                      ({workload?.story_points} points &bull; {workload?.assigned_tickets_count} tickets)
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                      isOverloaded
                        ? 'bg-red-100 text-red-700 border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {isOverloaded ? 'Overloaded' : 'Optimal Capacity'}
                  </span>
                </div>
              </div>

              {/* Section 1: PR Review Turnaround Time */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="w-4 h-4 text-[#4F46E5]" />
                    <h4 className="text-[14px] font-bold text-[#0F172A]">
                      PR Review Turnaround Analytics
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" />
                    {prTurnaround?.turnaround_rating === 'fast'
                      ? 'Fast Reviewer'
                      : 'Moderate Reviewer'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-slate-50 rounded-lg border border-[#E2E8F0]/80">
                    <p className="text-[11px] text-[#64748B]">Avg Response Time</p>
                    <p className="text-[16px] font-bold text-[#0F172A] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#4F46E5]" />
                      {prTurnaround?.avg_review_hours} hrs
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-[#E2E8F0]/80">
                    <p className="text-[11px] text-[#64748B]">PRs Reviewed</p>
                    <p className="text-[16px] font-bold text-[#0F172A] mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {prTurnaround?.prs_reviewed_count} PRs
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-[#E2E8F0]/80">
                    <p className="text-[11px] text-[#64748B]">Avg Time to Merge</p>
                    <p className="text-[16px] font-bold text-[#0F172A] mt-0.5 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      {prTurnaround?.avg_time_to_merge_hours} hrs
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Recent Commit Activity */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-[#1F3864]" />
                    <h4 className="text-[14px] font-bold text-[#0F172A]">
                      Recent Commit Stream
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#64748B]">
                    {commits.length} recent commits synced
                  </span>
                </div>

                <div className="space-y-2.5">
                  {commits.map((commit) => (
                    <div
                      key={commit.id}
                      className="p-3.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-[11px] font-bold text-[#1F3864] bg-slate-200/80 px-2 py-0.5 rounded shrink-0">
                            {commit.hash}
                          </span>
                          <span className="text-[13px] font-semibold text-[#0F172A] truncate">
                            {commit.message}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#64748B] shrink-0">
                          {commit.timestamp}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
                        <div className="flex items-center gap-1.5">
                          <GitBranch className="w-3 h-3 text-[#64748B]" />
                          <span className="font-mono text-slate-700">{commit.branch}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-emerald-600 font-semibold">
                            +{commit.lines_added}
                          </span>
                          <span className="text-red-500 font-semibold">
                            -{commit.lines_deleted}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#E2E8F0] bg-slate-50/80 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={closeDrilldown}
            className="px-4 py-2 text-[13px] font-semibold text-white bg-[#1F3864] hover:bg-[#16294a] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Close Drilldown
          </button>
        </div>
      </div>
    </div>
  )
}
