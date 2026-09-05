'use client'

import React from 'react'
import Link from 'next/link'
import { Meeting } from '@/types'
import { Clock, CheckCircle2, ArrowRight, Mic, Sparkles, FileAudio, Users } from 'lucide-react'

interface MeetingCardProps {
  meeting: Meeting
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-lg transition-all duration-300 group block space-y-4 hover:border-indigo-200"
    >
      {/* Top row: Title + Unverified Badge / Confidence */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center border border-indigo-100/80 shrink-0">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-[15px] font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors line-clamp-1">
              {meeting.title}
            </h3>
          </div>
          {meeting.audio_filename && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] pl-9">
              <FileAudio className="w-3 h-3 text-[#94A3B8]" />
              <span className="font-mono">{meeting.audio_filename}</span>
            </div>
          )}
        </div>

        {meeting.unverified_count > 0 ? (
          <span className="text-[11px] font-bold bg-amber-50 text-[#D97706] border border-amber-200 px-2.5 py-0.5 rounded-full shrink-0 shadow-xs">
            {meeting.unverified_count} unverified
          </span>
        ) : (
          <span className="text-[11px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3 h-3" />
            <span>All Verified</span>
          </span>
        )}
      </div>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#64748B] pt-1">
        <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
          <Clock className="w-3.5 h-3.5 text-[#64748B]" />
          <span>{meeting.date} &bull; {meeting.duration}</span>
        </span>

        <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 font-medium text-[#0F172A]">
          {meeting.action_items_count || meeting.action_items?.length || 0} Action Items
        </span>

        {meeting.confidence_score && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50/80 border border-emerald-100 px-2 py-0.5 rounded-md font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>{meeting.confidence_score}% Whisper AI</span>
          </span>
        )}
      </div>

      {/* Participants if available */}
      {meeting.participants && meeting.participants.length > 0 && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
          <Users className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="truncate">
            {meeting.participants.join(', ')}
          </span>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[12px] font-semibold text-[#4F46E5]">
        <span>View Transcript &amp; Checklist</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  )
}
