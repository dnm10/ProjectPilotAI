'use client'

import React, { useState } from 'react'
import { FileText, Copy, Download } from 'lucide-react'

export default function ReportsPage() {
  const [activeVersion, setActiveVersion] = useState<'technical' | 'stakeholder'>('technical')

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#1F3864]" />
            Audience-Aware Auto Reports
          </h1>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Same sprint telemetry, tailored for technical teams vs. executive stakeholders.
          </p>
        </div>

        {/* Version Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-[#E2E8F0]">
          <button
            onClick={() => setActiveVersion('technical')}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition-all ${
              activeVersion === 'technical'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Technical View
          </button>
          <button
            onClick={() => setActiveVersion('stakeholder')}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition-all ${
              activeVersion === 'stakeholder'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Stakeholder View
          </button>
        </div>
      </div>

      {/* Report Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-sm space-y-6 leading-[1.7]">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#0F172A]">
              Sprint 3 Executive Briefing (Week of Aug 19, 2026)
            </h2>
            <p className="text-[12px] text-[#64748B]">Audience: {activeVersion === 'technical' ? 'Engineering Leads & Developers' : 'Product Owners & Stakeholders'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] px-3 py-1.5 rounded-lg">
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
            <button className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] px-3.5 py-1.5 rounded-lg shadow-xs">
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {activeVersion === 'technical' ? (
          <div className="space-y-4 text-[13px] text-[#0F172A]">
            <p><strong>Sprint Health:</strong> Velocity tracking at 64% completion on Day 6 of 10. 13 story points across 3 PRs merged.</p>
            <p><strong>Risk Radar:</strong> TICKET-142 has elevated cyclomatic complexity in payment webhook handlers. 0 new unit tests added in PR #212.</p>
            <p><strong>Recommendation:</strong> Allocate 1 engineering day for Meera to pair on integration tests before merging payment gateway branch.</p>
          </div>
        ) : (
          <div className="space-y-4 text-[13px] text-[#0F172A]">
            <p><strong>Executive Summary:</strong> The team is on track for the planned Aug 24 release. Core authentication and user profile features are completed.</p>
            <p><strong>Delivery Forecast:</strong> 81% mathematical probability of on-time sprint completion with current team resource allocation.</p>
            <p><strong>Key Milestones:</strong> Stripe payment integration scheduled for QA staging deployment this Friday.</p>
          </div>
        )}
      </div>
    </div>
  )
}