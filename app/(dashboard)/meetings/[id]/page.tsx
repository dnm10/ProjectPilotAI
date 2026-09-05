'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMeeting } from '@/hooks/useMeetings'
import TranscriptViewer from '@/components/features/meetings/TranscriptViewer'
import ActionItemsChecklist from '@/components/features/meetings/ActionItemsChecklist'
import { ArrowLeft, Video, Clock, Users, Loader2, Sparkles, AlertCircle } from 'lucide-react'

export default function MeetingDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || 'meet-1'

  const { data: meeting, isLoading, error } = useMeeting(id)

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-sm text-[#64748B]">
        <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
        <p>Loading meeting transcript &amp; action items...</p>
      </div>
    )
  }

  if (error || !meeting) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
        <h2 className="text-[16px] font-bold text-[#0F172A]">Meeting Not Found</h2>
        <p className="text-[13px] text-[#64748B]">
          Could not locate the requested meeting recording or transcript.
        </p>
        <Link
          href="/meetings"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#4F46E5] hover:text-[#4338CA]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Meetings</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2">
        <Link
          href="/meetings"
          className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Meetings</span>
        </Link>
        <span className="text-[#94A3B8] text-xs">/</span>
        <span className="text-[12px] font-semibold text-[#0F172A] truncate max-w-xs">
          {meeting.title}
        </span>
      </div>

      {/* Header Info Banner */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#1F3864] flex items-center justify-center border border-indigo-100">
              <Video className="w-4 h-4" />
            </div>
            <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
              {meeting.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#64748B] pt-0.5">
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#64748B]" />
              <span>{meeting.date} &bull; {meeting.duration}</span>
            </span>

            {meeting.participants && meeting.participants.length > 0 && (
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                <Users className="w-3.5 h-3.5 text-[#64748B]" />
                <span>{meeting.participants.join(', ')}</span>
              </span>
            )}
          </div>
        </div>

        {meeting.confidence_score && (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center gap-3 self-start md:self-auto">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Whisper AI Accuracy
              </span>
              <span className="text-[16px] font-extrabold text-[#16A34A]">
                {meeting.confidence_score}% Confidence
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (60% on desktop): Scrollable Transcript Viewer */}
        <div className="lg:col-span-7">
          <TranscriptViewer
            transcript={meeting.transcript}
            segments={meeting.transcript_segments}
            confidenceScore={meeting.confidence_score}
            audioFilename={meeting.audio_filename}
          />
        </div>

        {/* Right Column (40% on desktop): Closed-Loop Action Items Checklist */}
        <div className="lg:col-span-5">
          <ActionItemsChecklist
            actionItems={meeting.action_items || []}
            meetingId={meeting.id}
          />
        </div>
      </div>
    </div>
  )
}