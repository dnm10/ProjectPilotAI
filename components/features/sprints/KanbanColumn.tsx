import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Ticket, TicketStatus } from '@/types'
import TicketCard from './TicketCard'

interface KanbanColumnProps {
  status: TicketStatus
  title: string
  tickets: Ticket[]
}

export default function KanbanColumn({ status, title, tickets }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl bg-slate-100/70 border border-[#E2E8F0] p-3 transition-colors ${
        isOver ? 'bg-indigo-50/70 border-[#4F46E5]' : ''
      }`}
    >
      {/* Column Header with Light Gray Header (#F1F5F9) */}
      <div className="flex items-center justify-between bg-[#F1F5F9] px-3 py-2 rounded-lg border border-[#E2E8F0] mb-3">
        <span className="text-[13px] font-bold text-[#0F172A]">{title}</span>
        <span className="text-[11px] font-bold bg-white text-[#64748B] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
          {tickets.length}
        </span>
      </div>

      {/* Tickets List */}
      <div className="space-y-2.5 flex-1 min-h-[450px]">
        {tickets.map((ticket) => (
          <div key={ticket.id}>
            <TicketCard ticket={ticket} />
          </div>
        ))}
        {tickets.length === 0 && (
          <div className="h-24 border-2 border-dashed border-[#E2E8F0] rounded-lg flex items-center justify-center text-[12px] text-[#64748B]">
            No tickets
          </div>
        )}
      </div>
    </div>
  )
}