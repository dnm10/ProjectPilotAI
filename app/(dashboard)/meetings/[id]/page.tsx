'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

export default function MeetingDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/meetings"
          className="flex items-center gap-1 text-[12px] font-medium text-[#64748B] hover:text-[#0F172A]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Meetings</span>
        </Link>
        <span className="text-[#64748B] text-xs">/</span>
        <span className="text-[12px] font-semibold text-[#0F172A]">Sprint 3 Kickoff</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (60%): Transcript */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm space-y-3">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Meeting Transcript (Whisper AI)</h2>
          <div className="h-[450px] overflow-y-auto bg-slate-50 p-4 rounded-lg font-mono text-[12px] text-[#0F172A] leading-relaxed border border-[#E2E8F0]">
            <p className="mb-2"><span className="font-bold text-[#1F3864]">[00:02] Aditi:</span> Let&apos;s finalize the Stripe payment webhook scope today.</p>
            <p className="mb-2"><span className="font-bold text-[#1F3864]">[00:14] Rohan:</span> I&apos;ll build the checkout UI components and hook up form validation.</p>
            <p className="mb-2"><span className="font-bold text-[#1F3864]">[01:05] Kabir:</span> I will set up the push notification listeners for payment events by Friday.</p>
            <p className="text-[#64748B] italic">[Transcription verified with 98.4% audio confidence score]</p>
          </div>
        </div>

        {/* Right Column (40%): Action Items Checklist */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Extracted Action Items</h2>
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg border border-[#E2E8F0] bg-slate-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#0F172A]">Aditi Sharma</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Verified Done</span>
              </div>
              <p className="text-[12px] text-[#64748B]">Add webhook refund listener</p>
            </div>

            <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#0F172A]">Kabir Mehta</span>
                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">Flagged Incomplete</span>
              </div>
              <p className="text-[12px] text-[#0F172A]">Setup push notification service worker (Due Aug 18)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}