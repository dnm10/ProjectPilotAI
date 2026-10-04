'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { useChatDraftStore } from '@/store/useChatDraftStore'
import { useChatHistory, useSendMessage } from '@/hooks/useChat'
import {
  Send,
  Sparkles,
  Bot,
  User,
  ArrowUpRight,
  Loader2,
  FileText,
  Ticket,
} from 'lucide-react'

const SUGGESTIONS = [
  'Which tickets have high risk scores?',
  'What is our current sprint velocity?',
  'Who is overloaded this week?',
  'Summarize recent PR review blockers',
]

export default function ChatAssistantPage() {
  const { draftMessage, setDraftMessage, clearDraft } = useChatDraftStore()
  const { data: messages = [], isLoading } = useChatHistory()
  const sendMessageMutation = useSendMessage()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sendMessageMutation.isPending])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!draftMessage.trim() || sendMessageMutation.isPending) return

    const textToSend = draftMessage
    clearDraft()
    await sendMessageMutation.mutateAsync(textToSend)
  }

  const handleSuggestionClick = (prompt: string) => {
    setDraftMessage(prompt)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-[#0F172A] tracking-tight">
              ProjectPilot RAG Assistant
            </h1>
            <p className="text-[12px] text-[#64748B]">
              Grounded in live GitHub commits, Jira tickets &amp; Sprint 3 data
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Vector RAG
        </span>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto py-6 space-y-5 px-1">
        {isLoading ? (
          <div className="p-8 text-center text-[#64748B]">Loading assistant history...</div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user'

            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                    isUser
                      ? 'bg-[#1F3864] text-white'
                      : 'bg-[#4F46E5] text-white'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[75%] rounded-2xl p-4 shadow-sm text-[13px] leading-relaxed ${
                    isUser
                      ? 'bg-[#4F46E5] text-white rounded-tr-none'
                      : 'bg-white border border-[#E2E8F0] text-[#0F172A] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Source Citation Chips (Page 10 PDF) */}
                  {msg.source_chips && msg.source_chips.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#E2E8F0]/80 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                        Referenced Sources:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.source_chips.map((chip) => (
                          <Link
                            key={chip.id}
                            href={chip.url}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-[11px] font-medium transition-colors border border-[#E2E8F0] group"
                          >
                            {chip.type === 'ticket' ? (
                              <Ticket className="w-3 h-3 text-[#4F46E5]" />
                            ) : (
                              <FileText className="w-3 h-3 text-[#64748B]" />
                            )}
                            <span>{chip.label}</span>
                            <ArrowUpRight className="w-2.5 h-2.5 text-[#64748B] group-hover:text-[#4F46E5]" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-1.5 text-right ${
                      isUser ? 'text-indigo-200' : 'text-[#64748B]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            )
          })
        )}

        {/* Loading Bubble when Assistant is Thinking */}
        {sendMessageMutation.isPending && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center gap-2 text-[13px] text-[#64748B]">
              <Loader2 className="w-4 h-4 animate-spin text-[#4F46E5]" />
              <span>Querying vector database &amp; analyzing telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompts */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#4F46E5]" />
          Suggested:
        </span>
        {SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleSuggestionClick(item)}
            className="text-[11px] bg-white border border-[#E2E8F0] hover:border-[#4F46E5] text-[#0F172A] px-3 py-1 rounded-full whitespace-nowrap transition-colors shadow-2xs"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Pinned Input Bar */}
      <form onSubmit={handleSend} className="pt-2">
        <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#4F46E5]/20 focus-within:border-[#4F46E5]">
          <input
            type="text"
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            placeholder="Ask anything about tickets, risks, team workload, or sprint delivery..."
            className="flex-1 px-3 py-2 text-[13px] text-[#0F172A] bg-transparent focus:outline-none placeholder-[#64748B]"
          />
          <button
            type="submit"
            disabled={!draftMessage.trim() || sendMessageMutation.isPending}
            className="w-10 h-10 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}