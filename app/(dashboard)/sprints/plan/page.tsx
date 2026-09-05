'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useFilterStore } from '@/store/useFilterStore'
import { useGenerateTasks, usePlanSprint } from '@/hooks/useSprintPlanning'
import {
  DraftTask,
  DeveloperSchedule,
  createSprint,
  createTickets,
} from '@/lib/api/planning'
import {
  Sparkles,
  Loader2,
  CalendarCheck,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'

const SAMPLE_PROMPT =
  'We are building Sprint 3: GitHub OAuth integration, Supabase RLS security policies, Monte Carlo What-If probability chart, and automated closed-loop meeting action item verification.'

export default function SprintPlanningPage() {
  const [requirements, setRequirements] = useState(SAMPLE_PROMPT)
  const [sprintName, setSprintName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [tasks, setTasks] = useState<DraftTask[]>([])
  const [schedules, setSchedules] = useState<DeveloperSchedule[] | null>(null)

  const generateTasksMutation = useGenerateTasks()
  const planSprintMutation = usePlanSprint()

  const { setSelectedSprintId } = useFilterStore()

  const handleCreateSprint = async () => {
  if (!sprintName.trim() || !startDate || !endDate) {
    alert('Please enter sprint name, start date, and end date.')
    return
  }

  const selectedTasks = tasks.filter((task) => task.is_included)

  if (selectedTasks.length === 0) {
    alert('Please select at least one task.')
    return
  }

  try {
    // Step 1: Create sprint
    const sprintResult = await createSprint({
      name: sprintName,
      start_date: startDate,
      end_date: endDate,
      planned_velocity: totalPoints,
      status: 'planned',
    })

    const sprintId = sprintResult.sprint.id

    setSelectedSprintId(sprintId)

    console.log('Sprint created:', sprintResult)

    // Step 2: Create tickets for this sprint
    const ticketResult = await createTickets(
      sprintId,
      selectedTasks
    )

    console.log('Tickets created:', ticketResult)

    alert('Sprint and tickets created successfully!')
  } catch (error) {
    console.error('Failed to create sprint:', error)
    alert('Failed to create sprint or tickets.')
  }
}

  const handleGenerate = async () => {
    if (!requirements.trim()) return

    const result = await generateTasksMutation.mutateAsync(requirements)

    setTasks(result)
    setSchedules(null)
  }

  const handleToggleInclude = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, is_included: !t.is_included } : t
      )
    )
  }

  const handleUpdateTask = (
    id: string,
    field: keyof DraftTask,
    value: any
  ) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      )
    )
  }

  const handlePlanSprint = async () => {
    const activeTasks = tasks.filter((t) => t.is_included)

    if (activeTasks.length === 0) return

    const result = await planSprintMutation.mutateAsync(activeTasks)

    setSchedules(result)
  }

  const totalPoints = tasks
    .filter((t) => t.is_included)
    .reduce((sum, t) => sum + Number(t.story_points || 0), 0)

  return (
    <div className="space-y-6">

      {/* Top Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link
            href="/sprints/board"
            className="flex items-center gap-1 text-[12px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sprint Board</span>
          </Link>

          <span className="text-[#64748B] text-xs">/</span>

          <span className="text-[12px] font-semibold text-[#0F172A]">
            AI Sprint Planning
          </span>
        </div>

        <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
          AI Sprint Planner &amp; Task Generator
        </h1>

        <p className="text-[13px] text-[#64748B]">
          Paste feature specs to generate granular tasks, edit story points,
          and generate a balanced schedule.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">

        {/* Sprint Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

          {/* Sprint Name */}
          <div>
            <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">
              Sprint Name
            </label>

            <input
              type="text"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              placeholder="e.g. Sprint 3"
              className="w-full p-2.5 text-[13px] text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2.5 text-[13px] text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2.5 text-[13px] text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
          </div>

        </div>

        {/* Requirements */}
        <div className="flex items-center justify-between mb-3">
          <label className="text-[13px] font-bold text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
            Feature Requirements / User Stories
          </label>

          <button
            type="button"
            onClick={() => setRequirements(SAMPLE_PROMPT)}
            className="text-[11px] text-[#4F46E5] hover:underline"
          >
            Insert sample prompt
          </button>
        </div>

        <textarea
          rows={4}
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Paste your requirements here..."
          className="w-full p-3.5 text-[13px] text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder-[#64748B] resize-none leading-relaxed"
        />

        {/* Generate Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleGenerate}
            disabled={
              generateTasksMutation.isPending ||
              !requirements.trim()
            }
            className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {generateTasksMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Decomposing Tasks with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Tasks with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Tasks */}
      {tasks.length > 0 && (
        <div className="space-y-4">

          {/* Task Header */}
          <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center gap-3">

              <span className="text-[14px] font-bold text-[#0F172A]">
                Generated Draft Tasks ({tasks.length})
              </span>

              <span className="text-[12px] font-semibold bg-indigo-50 text-[#4F46E5] px-2.5 py-0.5 rounded-full border border-indigo-100">
                Total: {totalPoints} Story Points
              </span>

            </div>

            <span className="text-[12px] text-[#64748B]">
              Review, edit, and toggle inclusion before planning
            </span>
          </div>

          {/* Tasks */}
          <div className="space-y-3">

            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl border p-5 shadow-sm transition-all ${
                  task.is_included
                    ? 'border-[#E2E8F0]'
                    : 'border-slate-200 bg-slate-50/50 opacity-60'
                }`}
              >

                <div className="flex items-start gap-3">

                  <input
                    type="checkbox"
                    checked={task.is_included}
                    onChange={() => handleToggleInclude(task.id)}
                    className="w-4 h-4 mt-1 rounded text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                  />

                  <div className="flex-1 space-y-3">

                    {/* Task title + points */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">

                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) =>
                          handleUpdateTask(
                            task.id,
                            'title',
                            e.target.value
                          )
                        }
                        className="w-full md:w-4/5 font-bold text-[14px] text-[#0F172A] bg-transparent border-b border-transparent hover:border-[#E2E8F0] focus:border-[#4F46E5] focus:bg-[#F8FAFC] px-1 py-0.5 rounded outline-none"
                      />

                      <div className="flex items-center gap-3 shrink-0">

                        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <span className="text-[11px] font-semibold text-[#64748B]">
                            Points:
                          </span>

                          <input
                            type="number"
                            min="1"
                            max="21"
                            value={task.story_points}
                            onChange={(e) =>
                              handleUpdateTask(
                                task.id,
                                'story_points',
                                Number(e.target.value)
                              )
                            }
                            className="w-10 text-center font-bold text-[12px] bg-white border border-[#E2E8F0] rounded py-0.5 text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                          />
                        </div>

                        {task.suggested_developer && (
                          <span className="text-[11px] font-medium bg-slate-100 text-[#64748B] px-2.5 py-1 rounded-lg">
                            {task.suggested_developer}
                          </span>
                        )}

                      </div>
                    </div>

                    {/* Description */}
                    <textarea
                      rows={2}
                      value={task.description}
                      onChange={(e) =>
                        handleUpdateTask(
                          task.id,
                          'description',
                          e.target.value
                        )
                      }
                      className="w-full text-[12px] text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] resize-none leading-relaxed"
                    />

                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* Plan Sprint Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handlePlanSprint}
              disabled={
                planSprintMutation.isPending ||
                totalPoints === 0
              }
              className="flex items-center gap-2 bg-[#1F3864] hover:bg-[#2F5496] text-white px-6 py-3 rounded-xl text-[14px] font-semibold transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {planSprintMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Optimizing Workload Schedule...</span>
                </>
              ) : (
                <>
                  <CalendarCheck className="w-4 h-4 text-[#818CF8]" />
                  <span>
                    Plan Sprint ({totalPoints} Points)
                  </span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* Schedule Table */}
      {schedules && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">

          {/* Schedule Header */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />

              <h3 className="text-[16px] font-bold text-[#0F172A]">
                Optimized Sprint Schedule
              </h3>
            </div>

            <span className="text-[12px] font-semibold text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Balanced Workload
            </span>

          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">

              <thead className="bg-[#F8FAFC] text-[#64748B] text-[11px] font-bold uppercase tracking-wider border-y border-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-4">Developer</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Assigned Tasks</th>
                  <th className="py-3 px-4">Story Points</th>
                  <th className="py-3 px-4">Est. Days</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E8F0]">

                {schedules.map((dev) => (
                  <tr
                    key={dev.developer_name}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-[#0F172A]">
                      {dev.developer_name}
                    </td>

                    <td className="py-3.5 px-4 text-[#64748B]">
                      {dev.role}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#0F172A]">
                      {dev.assigned_tasks_count}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#4F46E5]">
                      {dev.assigned_points} pts
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#0F172A]">
                      {dev.estimated_days} days
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {/* Create Sprint Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleCreateSprint}
              className="flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white px-6 py-3 rounded-xl text-[14px] font-semibold transition-colors shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Sprint</span>
            </button>
          </div>

        </div>
      )}
    </div>
  )
}