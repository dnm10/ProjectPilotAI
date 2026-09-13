'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Loader2,
  Plus,
  Sparkles,
  Users,
  X,
} from 'lucide-react'

import {
  useGenerateTasks,
  usePlanSprint,
} from '@/hooks/useSprintPlanning'

import {
  createSprint,
  createTickets,
} from '@/lib/api/planning'

import { fetchTeamMembers } from '@/lib/api/team'

import type {
  DraftTask,
  DeveloperSchedule,
} from '@/lib/api/planning'

import type { TeamMember } from '@/types'

export default function SprintPlanningPage() {
  const [requirements, setRequirements] = useState('')
  const [sprintName, setSprintName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [tasks, setTasks] = useState<DraftTask[]>([])
  const [schedules, setSchedules] = useState<
    DeveloperSchedule[]
  >([])

  const [teamMembers, setTeamMembers] = useState<
    TeamMember[]
  >([])

  const [isLoadingTeamMembers, setIsLoadingTeamMembers] =
    useState(false)

  const [isCreatingSprint, setIsCreatingSprint] =
    useState(false)

  const [error, setError] = useState('')

  const generateTasksMutation = useGenerateTasks()
  const planSprintMutation = usePlanSprint()

  useEffect(() => {
    async function loadTeamMembers() {
      try {
        setIsLoadingTeamMembers(true)
        setError('')

        const teamId = localStorage.getItem(
          'projectpilot_team_id'
        )

        if (!teamId) {
          setError(
            'Please select a team before planning the sprint.'
          )
          return
        }

        const members = await fetchTeamMembers(teamId)

        setTeamMembers(members)
      } catch (err) {
        console.error(err)
        setError('Failed to load team members.')
      } finally {
        setIsLoadingTeamMembers(false)
      }
    }

    loadTeamMembers()
  }, [])

  async function handleGenerateTasks() {
    if (!requirements.trim()) {
      setError('Please enter sprint requirements.')
      return
    }

    try {
      setError('')

      const generatedTasks =
        await generateTasksMutation.mutateAsync(
          requirements
        )

      const updatedTasks = generatedTasks.map((task) => ({
        ...task,
        is_included: task.is_included ?? true,
        assignee_id: '',
        assigned_developer_name: '',
      }))

      setTasks(updatedTasks)
      setSchedules([])
    } catch (err) {
      console.error(err)
      setError('Failed to generate tasks.')
    }
  }

  function handleToggleInclude(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              is_included: !task.is_included,
            }
          : task
      )
    )
  }

  function handleAssignDeveloper(
    taskId: string,
    developerId: string
  ) {
    const selectedMember = teamMembers.find(
      (member) => member.id === developerId
    )

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              assignee_id: developerId,
              assigned_developer_name:
                selectedMember?.name || '',
            }
          : task
      )
    )
  }

  function handleUpdateTask(
    taskId: string,
    field: 'title' | 'description' | 'story_points',
    value: string
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              [field]:
                field === 'story_points'
                  ? Number(value)
                  : value,
            }
          : task
      )
    )
  }

  async function handlePlanSprint() {
    const activeTasks = tasks.filter(
      (task) => task.is_included
    )

    if (activeTasks.length === 0) {
      setError('Please include at least one task.')
      return
    }

    const unassignedTask = activeTasks.find(
      (task) => !task.assignee_id
    )

    if (unassignedTask) {
      setError(
        `Please assign a developer to "${unassignedTask.title}".`
      )
      return
    }

    if (teamMembers.length === 0) {
      setError(
        'No team members found. Please select a team first.'
      )
      return
    }

    try {
      setError('')

      const result =
        await planSprintMutation.mutateAsync({
          tasks: activeTasks,
          teamMembers,
        })

      setSchedules(result)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to plan sprint.'
      )
    }
  }

  async function handleCreateSprint() {
    if (!sprintName.trim()) {
      setError('Please enter a sprint name.')
      return
    }

    if (!startDate || !endDate) {
      setError('Please select start and end dates.')
      return
    }

    if (endDate < startDate) {
      setError('End date cannot be before start date.')
      return
    }

    const activeTasks = tasks.filter(
      (task) => task.is_included
    )

    if (activeTasks.length === 0) {
      setError('Please include at least one task.')
      return
    }

    const unassignedTask = activeTasks.find(
      (task) => !task.assignee_id
    )

    if (unassignedTask) {
      setError(
        `Please assign a developer to "${unassignedTask.title}".`
      )
      return
    }

    try {
      setError('')
      setIsCreatingSprint(true)

      const totalPoints = activeTasks.reduce(
        (sum, task) =>
          sum + Number(task.story_points || 0),
        0
      )

      const sprintResponse = await createSprint({
        name: sprintName,
        start_date: startDate,
        end_date: endDate,
        planned_velocity: totalPoints,
        status: 'planned',
      })

      const sprintId =
        sprintResponse.sprint?.id ||
        sprintResponse.id

      if (!sprintId) {
        throw new Error(
          'Sprint was created but no sprint ID was returned.'
        )
      }

      await createTickets(sprintId, activeTasks)

      alert('Sprint and tickets created successfully!')

      setTasks([])
      setSchedules([])
      setRequirements('')
      setSprintName('')
      setStartDate('')
      setEndDate('')
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create sprint.'
      )
    } finally {
      setIsCreatingSprint(false)
    }
  }

  const totalPoints = tasks
    .filter((task) => task.is_included)
    .reduce(
      (sum, task) =>
        sum + Number(task.story_points || 0),
      0
    )

  const hasUnassignedTasks = tasks.some(
    (task) =>
      task.is_included && !task.assignee_id
  )

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/sprints"
              className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to Sprints
            </Link>

            <h1 className="text-2xl font-bold text-slate-900">
              Sprint Planning
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Generate tasks, assign developers, and plan your sprint.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateSprint}
            disabled={isCreatingSprint}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingSprint ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Plus size={17} />
            )}

            {isCreatingSprint
              ? 'Creating Sprint...'
              : 'Create Sprint'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* AI Requirements + Sprint Details */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

          {/* Generate Tasks */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-sky-100 p-2 text-sky-600">
                <Sparkles size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Generate Tasks with AI
                </h2>

                <p className="text-sm text-slate-500">
                  Describe what you want to complete in this sprint.
                </p>
              </div>
            </div>

            <textarea
              value={requirements}
              onChange={(event) =>
                setRequirements(event.target.value)
              }
              placeholder="Example: Build GitHub OAuth, configure Supabase RLS, add Monte Carlo probability chart..."
              className="min-h-36 w-full resize-none rounded-lg border border-slate-200 p-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />

            <button
              type="button"
              onClick={handleGenerateTasks}
              disabled={generateTasksMutation.isPending}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generateTasksMutation.isPending ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Sparkles size={17} />
              )}

              {generateTasksMutation.isPending
                ? 'Generating...'
                : 'Generate Tasks with AI'}
            </button>
          </section>

          {/* Sprint Details */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                <CalendarDays size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Sprint Details
                </h2>

                <p className="text-sm text-slate-500">
                  Configure your sprint timeline.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Sprint Name
                </label>

                <input
                  value={sprintName}
                  onChange={(event) =>
                    setSprintName(event.target.value)
                  }
                  placeholder="Sprint 1"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) =>
                      setStartDate(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) =>
                      setEndDate(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Generated Tasks */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Generated Tasks
              </h2>

              <p className="text-sm text-slate-500">
                Select tasks and assign them to team members.
              </p>
            </div>

            <div className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700">
              Total Points: {totalPoints}
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 py-12 text-center">
              <Sparkles
                size={28}
                className="mx-auto mb-3 text-slate-400"
              />

              <p className="text-sm text-slate-500">
                Generate tasks to see them here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-xl border p-4 ${
                    task.is_included
                      ? 'border-slate-200'
                      : 'border-slate-100 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleInclude(task.id)
                      }
                      className={`mt-1 flex h-5 w-5 items-center justify-center rounded border ${
                        task.is_included
                          ? 'border-sky-600 bg-sky-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {task.is_included && (
                        <Check size={13} />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          value={task.title}
                          onChange={(event) =>
                            handleUpdateTask(
                              task.id,
                              'title',
                              event.target.value
                            )
                          }
                          className="min-w-[250px] flex-1 rounded-md border border-transparent px-2 py-1 font-semibold text-slate-900 outline-none hover:border-slate-200 focus:border-sky-400"
                        />

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {task.story_points} points
                        </span>
                      </div>

                      <textarea
                        value={task.description}
                        onChange={(event) =>
                          handleUpdateTask(
                            task.id,
                            'description',
                            event.target.value
                          )
                        }
                        className="mt-2 min-h-16 w-full resize-none rounded-md border border-transparent px-2 py-1 text-sm text-slate-500 outline-none hover:border-slate-200 focus:border-sky-400"
                      />

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Users size={16} />
                          <span>Assign to:</span>
                        </div>

                        <div className="relative">
                          <select
                            value={task.assignee_id || ''}
                            onChange={(event) =>
                              handleAssignDeveloper(
                                task.id,
                                event.target.value
                              )
                            }
                            disabled={
                              isLoadingTeamMembers ||
                              !task.is_included
                            }
                            className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                          >
                            <option value="">
                              {isLoadingTeamMembers
                                ? 'Loading members...'
                                : 'Select developer'}
                            </option>

                            {teamMembers.map((member) => (
                              <option
                                key={member.id}
                                value={member.id}
                              >
                                {member.name} —{' '}
                                {member.role_in_team}
                              </option>
                            ))}
                          </select>

                          <ChevronDown
                            size={15}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                        </div>

                        {task.assigned_developer_name && (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                            Assigned to{' '}
                            {task.assigned_developer_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Developer Schedule */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Developer Schedule
              </h2>

              <p className="text-sm text-slate-500">
                Workload calculated from assigned sprint tasks.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePlanSprint}
              disabled={
                planSprintMutation.isPending ||
                tasks.length === 0
              }
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {planSprintMutation.isPending && (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              )}

              {planSprintMutation.isPending
                ? 'Planning...'
                : 'Plan Sprint'}
            </button>
          </div>

          {schedules.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 py-10 text-center">
              <Users
                size={28}
                className="mx-auto mb-3 text-slate-400"
              />

              <p className="text-sm text-slate-500">
                Assign tasks and click “Plan Sprint” to calculate
                developer workload.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="px-4 py-3">
                      Developer
                    </th>

                    <th className="px-4 py-3">
                      Role
                    </th>

                    <th className="px-4 py-3">
                      Assigned Points
                    </th>

                    <th className="px-4 py-3">
                      Estimated Days
                    </th>

                    <th className="px-4 py-3">
                      Tasks
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {schedules.map((schedule) => (
                    <tr
                      key={`${schedule.developer_name}-${schedule.role}`}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {schedule.developer_name}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {schedule.role}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        {schedule.assigned_points}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        {schedule.estimated_days}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        {schedule.assigned_tasks_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 pb-6">
          <Link
            href="/sprints"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleCreateSprint}
            disabled={
              isCreatingSprint ||
              tasks.length === 0 ||
              hasUnassignedTasks
            }
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingSprint && (
              <Loader2
                size={17}
                className="animate-spin"
              />
            )}

            {isCreatingSprint
              ? 'Creating Sprint...'
              : 'Create Sprint'}
          </button>
        </div>

      </div>
    </div>
  )
}