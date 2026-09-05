'use client'

import React from 'react'
import Link from 'next/link'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useFilterStore } from '@/store/useFilterStore'
import {
  useSprintTickets,
  useUpdateTicketStatus,
  useSprints,
} from '@/hooks/useSprintBoard'
import KanbanColumn from '@/components/features/sprints/KanbanColumn'
import { TicketStatus } from '@/types'
import { Plus, Users } from 'lucide-react'

const COLUMNS: { status: TicketStatus; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'in_review', title: 'In Review' },
  { status: 'done', title: 'Done' },
]

export default function SprintBoardPage() {
  const {
    selectedSprintId,
    selectedAssignee,
    setSelectedAssignee,
    setSelectedSprintId,
  } = useFilterStore()

  const { data: sprints = [] } = useSprints()

  React.useEffect(() => {
    if (!selectedSprintId && sprints.length > 0) {
      setSelectedSprintId(sprints[0].id)
    }
  }, [selectedSprintId, sprints, setSelectedSprintId])

  const { data: tickets = [], isLoading } =
    useSprintTickets(selectedSprintId)

  const updateStatusMutation =
    useUpdateTicketStatus(selectedSprintId)

  // Filter by assignee if quick-filter is active
  const filteredTickets =
    selectedAssignee === 'all'
      ? tickets
      : tickets.filter((t) =>
          t.assignee.name
            .toLowerCase()
            .includes(selectedAssignee.toLowerCase())
        )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const ticketId = active.id as string
    const newStatus = over.id as TicketStatus

    const currentTicket = tickets.find(
      (t) => t.id === ticketId
    )

    if (
      currentTicket &&
      currentTicket.status !== newStatus
    ) {
      updateStatusMutation.mutate({
        ticketId,
        newStatus,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
            Sprint Board
          </h1>

          <p className="text-[13px] text-[#64748B] mt-0.5">
  {sprints.find((sprint) => sprint.id === selectedSprintId)?.name || 'No sprint selected'}
  {' • '}
  {sprints.find((sprint) => sprint.id === selectedSprintId)?.start_date || ''}
  {' – '}
  {sprints.find((sprint) => sprint.id === selectedSprintId)?.end_date || ''}
</p>
        </div>

        {/* Controls: Assignee Filter + Plan Sprint Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">

          {/* Sprint Selector */}
<div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg text-[13px]">
  <select
    value={selectedSprintId}
    onChange={(e) => setSelectedSprintId(e.target.value)}
    className="bg-transparent text-[13px] font-medium text-[#0F172A] focus:outline-none cursor-pointer"
  >
    {sprints.map((sprint) => (
      <option key={sprint.id} value={sprint.id}>
        {sprint.name}
      </option>
    ))}
  </select>
</div>

          {/* Quick Assignee Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg text-[13px]">
            <Users className="w-4 h-4 text-[#64748B]" />

            <select
              value={selectedAssignee}
              onChange={(e) =>
                setSelectedAssignee(e.target.value)
              }
              className="bg-transparent text-[13px] font-medium text-[#0F172A] focus:outline-none cursor-pointer"
            >
              <option value="all">All Members</option>
              <option value="Aditi">Aditi Sharma</option>
              <option value="Rohan">Rohan Verma</option>
              <option value="Meera">Meera Iyer</option>
              <option value="Kabir">Kabir Mehta</option>
            </select>
          </div>

          {/* Plan New Sprint Button */}
          <Link
            href="/sprints/plan"
            className="flex items-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Sprint</span>
          </Link>
        </div>
      </div>

      {/* 4-Column Drag & Drop Board */}
      {isLoading ? (
        <div className="p-8 text-[#64748B]">
          Loading sprint board...
        </div>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.status}
                status={col.status}
                title={col.title}
                tickets={filteredTickets.filter(
                  (t) => t.status === col.status
                )}
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  )
}