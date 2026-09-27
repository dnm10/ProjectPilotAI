'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTicket } from '../../../../hooks/useTickets'
import RiskExplainPanel from '../../../../components/features/tickets/RiskExplainPanel'
import { ArrowLeft, GitPullRequest, ShieldAlert } from 'lucide-react'

export default function TicketDetailPage() {
  const params = useParams()
  const ticketId = (params?.id as string) || 'TICKET-142'
  const { data: ticket, isLoading } = useTicket(ticketId)
  const [activeTab, setActiveTab] = useState<'overview' | 'prs' | 'activity'>('overview')

  if (isLoading) {
    return <div className="p-8 text-[#64748B]">Loading ticket {ticketId}...</div>
  }

  if (!ticket) {
    return <div className="p-8 text-red-600">Ticket not found.</div>
  }

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center gap-2">
        <Link
          href="/sprints/board"
          className="flex items-center gap-1 text-[12px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sprint Board</span>
        </Link>
        <span className="text-[#64748B] text-xs">/</span>
        <span className="text-[12px] font-semibold text-[#0F172A]">{ticket.id}</span>
      </div>

      {/* Main 2-Column Grid (66% Left / 32% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (66% / 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#64748B] tracking-wider uppercase">
                {ticket.id}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                In Progress
              </span>
            </div>
            <h1 className="text-[20px] font-bold text-[#0F172A] mt-1">
              {ticket.title}
            </h1>
          </div>

          {/* Star Component: Risk Explain Panel */}
          {ticket.shap_explanation && (
            <RiskExplainPanel
              score={ticket.risk_score}
              riskType="Code-Aware"
              reasons={ticket.shap_explanation.reasons}
            />
          )}

          {/* Tabbed Section */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
            {/* Tab Headers */}
            <div className="flex items-center border-b border-[#E2E8F0] px-6">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'prs', label: 'Linked Commits & PRs' },
                { key: 'activity', label: 'Activity' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-3.5 px-4 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                    activeTab === tab.key
                      ? 'border-[#4F46E5] text-[#4F46E5] font-semibold'
                      : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                      Description
                    </h3>
                    <p className="text-[13px] text-[#0F172A] leading-relaxed">
                      {ticket.description}
                    </p>
                  </div>

                  {/* Linked Pull Requests */}
                  <div>
                    <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#64748B] mb-3">
                      Linked Pull Requests
                    </h3>
                    <div className="space-y-2">
                      {ticket.linked_prs?.map((pr) => (
                        <div
                          key={pr.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-slate-50/50"
                        >
                          <div className="flex items-center gap-2.5">
                            <GitPullRequest className="w-4 h-4 text-[#4F46E5]" />
                            <span className="text-[13px] font-semibold text-[#0F172A]">
                              #{pr.number} &bull; {pr.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              +{pr.lines_added} / -{pr.lines_deleted} lines
                            </span>
                            <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                              0 new tests
                            </span>
                            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              Review pending 3d
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'prs' && (
                <div className="text-[13px] text-[#64748B]">
                  Git commit history and branch diffs synced with GitHub webhook.
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="text-[13px] text-[#64748B]">
                  Audit log of risk score fluctuations and automated closed-loop checks.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (32% / 4 cols) - Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Assignee
              </p>
              <p className="text-[13px] font-semibold text-[#0F172A] mt-0.5">
                {ticket.assignee.name}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Sprint
              </p>
              <p className="text-[13px] font-semibold text-[#0F172A] mt-0.5">
                {ticket.sprint_name}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Story Points
              </p>
              <p className="text-[13px] font-semibold text-[#0F172A] mt-0.5">
                {ticket.story_points}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Priority
              </p>
              <p className="text-[13px] font-semibold text-[#DC2626] mt-0.5">
                High
              </p>
            </div>

            {/* Bus Factor Note */}
            {ticket.bus_factor_note && (
              <div className="pt-3 border-t border-[#E2E8F0]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Bus Factor Note
                </p>
                <p className="text-[12px] text-amber-900 font-medium mt-0.5 bg-amber-50 p-2 rounded border border-amber-200">
                  {ticket.bus_factor_note}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-[#E2E8F0]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Created
              </p>
              <p className="text-[12px] text-[#64748B] mt-0.5">
                {ticket.created_at}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}