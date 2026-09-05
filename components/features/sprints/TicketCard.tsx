import React from 'react'
import Link from 'next/link'
import { Ticket } from '@/types'
import { getRiskConfig } from '@/lib/riskColor'

interface TicketCardProps {
  ticket: Ticket
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const showRiskPill = ticket.risk_score >= 40
  const riskConfig = getRiskConfig(ticket.risk_score)

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-3.5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group">
      {/* Top Meta Row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
          {ticket.id}
        </span>

        {/* Risk Pill (Only if score >= 40% as required by PDF Page 6) */}
        {showRiskPill && (
          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${riskConfig.badgeClass}`}
          >
            {ticket.risk_score}%
          </span>
        )}
      </div>

      {/* Ticket Title */}
      <Link
        href={`/tickets/${ticket.id}`}
        className="block text-[12px] font-bold text-[#0F172A] mt-2 group-hover:text-[#4F46E5] transition-colors leading-snug line-clamp-2"
      >
        {ticket.title}
      </Link>

      {/* Bottom Row: Assignee + Story Points */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#E2E8F0]/70">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#1F3864] text-white flex items-center justify-center text-[9px] font-bold">
            {ticket.assignee.initials}
          </div>
          <span className="text-[11px] text-[#64748B] truncate max-w-[90px]">
            {ticket.assignee.name}
          </span>
        </div>

        <span className="text-[10px] font-semibold bg-slate-100 text-[#0F172A] px-2 py-0.5 rounded">
          {ticket.story_points} pts
        </span>
      </div>
    </div>
  )
}