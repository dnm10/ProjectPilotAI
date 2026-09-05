'use client'

import React from 'react'
import { useMeetings } from '@/hooks/useMeetings'
import { useMeetingModalStore } from '@/store/useMeetingModalStore'
import MeetingCard from '@/components/features/meetings/MeetingCard'
import UploadModal from '@/components/features/meetings/UploadModal'
import { Video, Upload, CheckCircle2, AlertTriangle, Sparkles, Loader2 } from 'lucide-react'

export default function MeetingsPage() {
  const { data: meetings = [], isLoading, error } = useMeetings()
  const { openUploadModal } = useMeetingModalStore()

  const totalActionItems = meetings.reduce(
    (acc, m) => acc + (m.action_items_count || m.action_items?.length || 0),
    0
  )
  const totalUnverified = meetings.reduce(
    (acc, m) => acc + (m.unverified_count || 0),
    0
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#1F3864] flex items-center justify-center border border-indigo-100">
              <Video className="w-4 h-4" />
            </div>
            <span>Meetings &amp; Audio Ingestion</span>
          </h1>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Ingest audio recordings (.mp3, .wav, .m4a), extract action items with Whisper AI, and verify commit follow-through.
          </p>
        </div>

        <button
          onClick={openUploadModal}
          className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] self-start sm:self-auto cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Recording</span>
        </button>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Ingested Meetings
            </span>
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
              <Video className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[22px] font-extrabold text-[#0F172A] mt-1">
            {isLoading ? '...' : meetings.length}
          </p>
          <span className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Whisper Large-v3 Pipeline</span>
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Action Items Tracked
            </span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[22px] font-extrabold text-[#0F172A] mt-1">
            {isLoading ? '...' : totalActionItems}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
            Extracted from audio transcripts
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Closed-Loop Flagged
            </span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[22px] font-extrabold text-[#0F172A] mt-1">
            {isLoading ? '...' : totalUnverified}
          </p>
          <span className="text-[11px] text-[#D97706] font-medium mt-0.5 block">
            Missing commit or PR verification
          </span>
        </div>
      </div>

      {/* Meetings Grid */}
      {isLoading ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-12 text-center text-sm text-[#64748B] flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-[#4F46E5] animate-spin" />
          <span>Loading ingested meetings...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-8 text-center text-sm text-red-700">
          Failed to load meetings. Please try refreshing.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </div>
      )}

      {/* Modal instance */}
      <UploadModal />
    </div>
  )
}