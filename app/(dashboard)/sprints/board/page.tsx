'use client'

import React from 'react'
import Link from 'next/link'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useFilterStore } from '@/store/useFilterStore'
import {
  useSprintTickets,
  useUpdateTicketStatus,
  useSprints,
  useDeleteSprint,
} from '@/hooks/useSprintBoard'
import KanbanColumn from '@/components/features/sprints/KanbanColumn'
import SprintBoardSkeleton from '@/components/features/sprints/SprintBoardSkeleton'
import { Skeleton } from '@/components/ui/Skeleton'
import { TicketStatus } from '@/types'
import { Plus, Trash2 } from 'lucide-react'

const COLUMNS: { status: TicketStatus; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'in_review', title: 'In Review' },
  { status: 'done', title: 'Done' },
]

export default function SprintBoardPage() {
  const [mounted, setMounted] = React.useState(false)
  const {
    selectedSprintId,
    selectedAssignee,
    setSelectedSprintId,
  } = useFilterStore()

  const { data: sprints = [] } = useSprints()

  const deleteSprintMutation = useDeleteSprint()

  React.useEffect(() => {
    setMounted(true)
    if (!selectedSprintId && sprints.length > 0) {
      setSelectedSprintId(sprints[0].id)
    }
  }, [selectedSprintId, sprints, setSelectedSprintId])

  const effectiveSprintId = selectedSprintId || sprints[0]?.id || ''

  const { data: tickets = [], isLoading } =
    useSprintTickets(effectiveSprintId)

  const updateStatusMutation =
    useUpdateTicketStatus(effectiveSprintId)

  if (!mounted || (isLoading && tickets.length === 0)) {
    return <SprintBoardSkeleton />
  }

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

  // Delete selected sprint
  const handleDeleteSprint = () => {
    if (!selectedSprintId) return

    const selectedSprint = sprints.find(
      (sprint) => sprint.id === selectedSprintId
    )

    if (!selectedSprint) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedSprint.name}"?`
    )

    if (!confirmed) return

    deleteSprintMutation.mutate(selectedSprintId, {
      onSuccess: () => {
        const remainingSprints = sprints.filter(
          (sprint) => sprint.id !== selectedSprintId
        )

        setSelectedSprintId(
          remainingSprints.length > 0
            ? remainingSprints[0].id
            : ''
        )
      },
    })
  }

  const currentSprint =
    sprints.find((sprint) => sprint.id === effectiveSprintId) ||
    sprints[0]

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
            Sprint Board
          </h1>

          {currentSprint ? (
            <p className="text-[13px] text-[#64748B] mt-0.5">
              {currentSprint.name}
              {(() => {
                if (!currentSprint.start_date || !currentSprint.end_date) return ''
                const s = new Date(currentSprint.start_date)
                const e = new Date(currentSprint.end_date)
                const dur = (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e >= s)
                  ? Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1)
                  : null
                return ` • ${currentSprint.start_date} – ${currentSprint.end_date}${dur ? ` (${dur} days)` : ''}`
              })()}
            </p>
          ) : (
            <div className="pt-1">
              <Skeleton className="h-4 w-48 rounded-md" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Sprint Selector */}
          {sprints.length > 0 ? (
            <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg text-[13px] shadow-2xs">
              <select
                value={selectedSprintId || currentSprint?.id}
                onChange={(e) =>
                  setSelectedSprintId(e.target.value)
                }
                className="bg-transparent text-[13px] font-medium text-[#0F172A] focus:outline-none cursor-pointer"
              >
                {sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <Skeleton className="h-9 w-28 rounded-lg" />
          )}

          {/* Quick Assignee Filter */}
          {/* <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg text-[13px]">
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
          </div> */}

          {/* Delete Sprint Button */}
          <button
            onClick={handleDeleteSprint}
            disabled={
              deleteSprintMutation.isPending ||
              !selectedSprintId
            }
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>
              {deleteSprintMutation.isPending
                ? 'Deleting...'
                : 'Delete Sprint'}
            </span>
          </button>

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
    </div>
  )
}