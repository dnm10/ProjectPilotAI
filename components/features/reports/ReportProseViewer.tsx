'use client'

import React from 'react'

interface ReportProseViewerProps {
  proseText: string
}

export default function ReportProseViewer({ proseText }: ReportProseViewerProps) {
  // Parse sections based on markdown-style ### headings or paragraphs
  const rawSections = proseText.split(/(?=###\s)/g).filter(Boolean)

  if (rawSections.length === 0) {
    return (
      <div className="text-[#64748B] text-[14px] italic leading-[1.7]">
        No report content available for this period.
      </div>
    )
  }

  return (
    <div className="space-y-6 text-[#334155] leading-[1.7] font-sans">
      {rawSections.map((section, idx) => {
        const lines = section.trim().split('\n')
        const headingLine = lines[0]?.startsWith('###') ? lines[0].replace(/^###\s*/, '') : null
        const contentLines = headingLine ? lines.slice(1) : lines

        return (
          <div key={idx} className="space-y-2.5 first:pt-0 pt-2">
            {headingLine && (
              <h3 className="text-[15px] font-bold text-[#0F172A] pb-1.5 border-b border-[#E2E8F0] tracking-tight">
                {headingLine}
              </h3>
            )}

            <div className="space-y-2 text-[14px] leading-[1.7]">
              {contentLines.map((line, lineIdx) => {
                const trimmed = line.trim()
                if (!trimmed) return null

                // Bullet point lines
                if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                  const itemContent = trimmed.replace(/^[•\-]\s*/, '')
                  return (
                    <div key={lineIdx} className="flex items-start gap-2 pl-2">
                      <span className="text-[#4F46E5] font-bold text-[16px] leading-tight select-none">&bull;</span>
                      <p className="flex-1 leading-[1.7]">{itemContent}</p>
                    </div>
                  )
                }

                // Numbered list lines (e.g. 1. 2. 3.)
                if (/^\d+\.\s/.test(trimmed)) {
                  const num = trimmed.match(/^(\d+)\.\s/)?.[1]
                  const text = trimmed.replace(/^\d+\.\s*/, '')
                  return (
                    <div key={lineIdx} className="flex items-start gap-2.5 pl-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100/80 text-[#4F46E5] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 select-none">
                        {num}
                      </span>
                      <p className="flex-1 leading-[1.7]">{text}</p>
                    </div>
                  )
                }

                return (
                  <p key={lineIdx} className="leading-[1.7]">
                    {trimmed}
                  </p>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
