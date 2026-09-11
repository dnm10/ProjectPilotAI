'use client'

import React, { useState } from 'react'
import { TranscriptSegment } from '@/types'
import { Search, Sparkles, Copy, Check, FileText, Volume2 } from 'lucide-react'

interface TranscriptViewerProps {
  transcript: string
  segments?: TranscriptSegment[]
  confidenceScore?: number
  audioFilename?: string
}

export default function TranscriptViewer({
  transcript,
  segments = [],
  confidenceScore = 98.4,
  audioFilename,
}: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Filter segments if searching
  const filteredSegments = segments.filter(
    (seg) =>
      seg.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seg.timestamp.includes(searchQuery)
  )

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center border border-indigo-100">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#0F172A] flex items-center gap-2">
              <span>Meeting Transcript</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-[#4F46E5] border border-indigo-100">
                Whisper AI
              </span>
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <Sparkles className="w-3 h-3" />
                {confidenceScore}% confidence score
              </span>
              {audioFilename && (
                <>
                  <span>&bull;</span>
                  <span className="font-mono text-[#64748B] flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    {audioFilename}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#64748B] hover:text-[#0F172A] bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Full Text</span>
            </>
          )}
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transcript by speaker, keyword, or timestamp..."
          className="w-full pl-9 pr-4 py-2 text-[12px] bg-slate-50/70 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-[#0F172A] placeholder-[#94A3B8]"
        />
        {searchQuery && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#64748B] font-mono">
            {filteredSegments.length} matches
          </span>
        )}
      </div>

      {/* Scrollable Transcript Box */}
      <div className="h-[460px] overflow-y-auto bg-slate-50/80 rounded-xl p-4 border border-[#E2E8F0] font-mono text-[12px] leading-relaxed divide-y divide-[#E2E8F0]/60 custom-scrollbar">
        {segments.length > 0 ? (
          filteredSegments.length > 0 ? (
            filteredSegments.map((seg) => (
              <div
                key={seg.id}
                className="py-3 first:pt-0 last:pb-0 hover:bg-white/80 -mx-2 px-2 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-[#4F46E5] bg-indigo-50 border border-indigo-100/80 px-1.5 py-0.5 rounded">
                    [{seg.timestamp}]
                  </span>
                  <span className="font-bold text-[#1F3864]">
                    {seg.speaker}:
                  </span>
                  {seg.action_item_id && (
                    <span className="text-[10px] font-sans font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      Action Item Extracted
                    </span>
                  )}
                </div>
                <p className="text-[#334155] pl-1 font-mono text-[12.5px] leading-normal">
                  {seg.text}
                </p>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#64748B]">
              <Search className="w-6 h-6 text-[#94A3B8] mb-2" />
              <p className="font-sans text-[13px] font-medium text-[#0F172A]">No matches found</p>
              <p className="font-sans text-[11px] text-[#64748B]">
                No transcript lines matching &quot;{searchQuery}&quot;
              </p>
            </div>
          )
        ) : (
          <div className="whitespace-pre-line text-[#0F172A] p-2">
            {transcript || 'No transcript text available for this recording.'}
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
        <span className="italic">
          Transcribed with Whisper Large-v3 &bull; Speaker Diarization Active
        </span>
        <span className="font-mono text-[10px] text-[#94A3B8]">
          {segments.length} dialogue segments
        </span>
      </div>
    </div>
  )
}
