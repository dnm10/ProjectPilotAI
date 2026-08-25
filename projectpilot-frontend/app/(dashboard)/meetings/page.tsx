'use client'

import React from 'react'
import Link from 'next/link'
import { Video, Upload, CheckCircle2, Clock, ArrowRight } from 'lucide-react'

export default function MeetingsPage() {
  const meetings = [
    {
      id: 'meet-1',
      title: 'Sprint 3 Kickoff & Architecture Alignment',
      date: 'Aug 14, 2026',
      duration: '42 mins',
      actionItemsCount: 5,
      unverifiedCount: 1,
    },
    {
      id: 'meet-2',
      title: 'Stripe Gateway & Security Review',
      date: 'Aug 16, 2026',
      duration: '28 mins',
      actionItemsCount: 3,
      unverifiedCount: 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Video className="w-6 h-6 text-[#1F3864]" />
            Meetings &amp; Audio Ingestion
          </h1>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Ingest audio recordings, extract action items, and verify commit follow-through.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
          <Upload className="w-4 h-4" />
          <span>Upload Recording</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meetings.map((m) => (
          <Link
            key={m.id}
            href={`/meetings/${m.id}`}
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-all group block space-y-4"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-[15px] font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">
                {m.title}
              </h3>
              {m.unverifiedCount > 0 && (
                <span className="text-[11px] font-bold bg-amber-50 text-[#D97706] border border-amber-200 px-2.5 py-0.5 rounded-full">
                  1 unverified
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-[12px] text-[#64748B]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {m.date} &bull; {m.duration}
              </span>
              <span>&bull;</span>
              <span>{m.actionItemsCount} action items</span>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[12px] font-semibold text-[#4F46E5]">
              <span>View Transcript &amp; Checklist</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}