import { API_BASE_URL } from './config'
import type { TeamMember } from '@/types'

export interface DraftTask {
  id: string
  title: string
  description: string
  story_points: number
  estimated_days?: number
  is_included: boolean
  suggested_developer?: string
  assignee_id?: string
  assigned_developer_name?: string
}

export interface DeveloperSchedule {
  developer_name: string
  role: string
  assigned_points: number
  estimated_days: number
  assigned_tasks_count: number
}

export function calculateSprintDuration(
  startDate?: string,
  endDate?: string
): number | null {
  if (!startDate || !endDate) return null
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return null
  return Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  )
}

export function fitTasksIntoSprintDuration<
  T extends { story_points?: number; estimated_days?: number }
>(tasks: T[], sprintDuration?: number | null): T[] {
  if (
    !sprintDuration ||
    sprintDuration <= 0 ||
    !Array.isArray(tasks) ||
    tasks.length === 0
  ) {
    return tasks
  }

  const maxAllowedTasks = Math.max(1, sprintDuration)
  const workingTasks =
    tasks.length > maxAllowedTasks ? tasks.slice(0, maxAllowedTasks) : tasks

  const n = workingTasks.length
  if (n >= sprintDuration) {
    return workingTasks.map((t) => ({ ...t, estimated_days: 1 }))
  }

  const currentTotal = workingTasks.reduce(
    (sum, t) => sum + (Number(t.estimated_days) || 1),
    0
  )
  if (currentTotal <= sprintDuration) {
    return workingTasks
  }

  const baseDays = 1
  const remainingDays = sprintDuration - n * baseDays
  const totalPoints = workingTasks.reduce(
    (sum, t) => sum + (Number(t.story_points) || 1),
    0
  )

  const allocations = workingTasks.map((t, index) => {
    const pts = Number(t.story_points) || 1
    const exact =
      totalPoints > 0
        ? (pts / totalPoints) * remainingDays
        : remainingDays / n
    const whole = Math.floor(exact)
    const remainder = exact - whole
    return { index, whole, remainder }
  })

  const allocatedWhole = allocations.reduce((sum, a) => sum + a.whole, 0)
  const leftOver = remainingDays - allocatedWhole

  allocations.sort((a, b) => b.remainder - a.remainder)
  for (let i = 0; i < leftOver; i++) {
    allocations[i % allocations.length].whole += 1
  }

  allocations.sort((a, b) => a.index - b.index)

  return workingTasks.map((t, idx) => ({
    ...t,
    estimated_days: baseDays + allocations[idx].whole,
  }))
}

function generateDynamicFallbackTasks(
  requirements: string,
  teamMembers: TeamMember[] = [],
  sprintDuration?: number | null
): DraftTask[] {
  const req = (requirements || '').trim()
  const lines = req
    .split(/\r?\n|;|\.\s+/)
    .map((l) => l.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter((l) => l.length > 5)

  let taskItems = lines.length > 0 ? lines : [req]
  if (sprintDuration && sprintDuration > 0 && taskItems.length > sprintDuration) {
    taskItems = taskItems.slice(0, sprintDuration)
  }

  const mapped = taskItems.map((item, index) => {
    return {
      id: `task-${Date.now()}-${index}`,
      title: item.length > 60 ? `${item.slice(0, 57)}...` : item,
      description: item,
      story_points: 3,
      estimated_days: 2,
      is_included: true,
      assignee_id: '',
      suggested_developer: '',
      assigned_developer_name: '',
    }
  })

  return fitTasksIntoSprintDuration(mapped, sprintDuration)
}

export interface GenerateTasksOptions {
  startDate?: string
  endDate?: string
  duration?: number | null
}

export async function generateTasksFromRequirements(
  requirements: string,
  teamMembers: TeamMember[] = [],
  options?: GenerateTasksOptions
): Promise<DraftTask[]> {
  const sprintDuration =
    options?.duration ||
    calculateSprintDuration(options?.startDate, options?.endDate)

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/ai/generate-tasks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requirements,
          startDate: options?.startDate,
          endDate: options?.endDate,
          duration: sprintDuration,
        }),
      }
    )

    if (!response.ok) {
      return generateDynamicFallbackTasks(
        requirements,
        teamMembers,
        sprintDuration
      )
    }

    const data = await response.json()
    if (!data.tasks || !Array.isArray(data.tasks) || data.tasks.length === 0) {
      return generateDynamicFallbackTasks(
        requirements,
        teamMembers,
        sprintDuration
      )
    }

    const maxAllowedTasks =
      sprintDuration && sprintDuration > 0
        ? Math.max(1, sprintDuration)
        : undefined

    const tasksList =
      maxAllowedTasks && data.tasks.length > maxAllowedTasks
        ? data.tasks.slice(0, maxAllowedTasks)
        : data.tasks

    const rawDraftTasks: DraftTask[] = tasksList.map((task: any, index: number) => {
      const rawPoints = Number(task.story_points) || 3
      const rawDays =
        task.estimated_days !== undefined
          ? Number(task.estimated_days)
          : Math.max(1, Math.ceil(rawPoints / 2))

      return {
        id: task.id || `draft-${Date.now()}-${index}`,
        title: task.title,
        description: task.description || '',
        story_points: rawPoints,
        estimated_days: rawDays,
        is_included: true,
        assignee_id: '',
        suggested_developer: '',
        assigned_developer_name: '',
      }
    })

    return fitTasksIntoSprintDuration(rawDraftTasks, sprintDuration)
  } catch {
    return generateDynamicFallbackTasks(
      requirements,
      teamMembers,
      sprintDuration
    )
  }
}

export async function planSprintSchedule(
  tasks: DraftTask[],
  teamMembers: TeamMember[]
): Promise<DeveloperSchedule[]> {
  const assignedTasks = tasks.filter(
    (task) => task.is_included && task.assignee_id
  )

  const schedules = teamMembers
    .map((member) => {
      const memberTasks = assignedTasks.filter(
        (task) => task.assignee_id === member.id
      )

      if (memberTasks.length === 0) {
        return null
      }

      const assignedPoints = memberTasks.reduce(
        (sum, task) => sum + Number(task.story_points || 0),
        0
      )

      const totalEstimatedDays = memberTasks.reduce(
        (sum, task) =>
          sum +
          (task.estimated_days !== undefined
            ? Number(task.estimated_days)
            : Math.max(1, Math.ceil(Number(task.story_points || 3) / 2))),
        0
      )

      return {
        developer_name: member.name,
        role: member.role_in_team || 'Member',
        assigned_points: assignedPoints,
        estimated_days: Math.max(1, totalEstimatedDays),
        assigned_tasks_count: memberTasks.length,
      }
    })
    .filter(
      (schedule): schedule is DeveloperSchedule =>
        schedule !== null
    )

  return schedules
}

export interface CreateSprintData {
  team_id?: string
  name: string
  start_date?: string
  end_date?: string
  planned_velocity?: number
  status?: string
}

export async function createSprint(
  sprintData: CreateSprintData
) {
  const response = await fetch(
    `${API_BASE_URL}/api/sprints`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sprintData),
    }
  )

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.message || 'Failed to create sprint'
    )
  }

  return data
}

export async function createTickets(
  sprintId: string,
  tickets: DraftTask[],
  teamId?: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/tickets`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sprint_id: sprintId,
        team_id: teamId || null,
        tickets: tickets.map((task) => ({
          title: task.title,
          description: task.description,
          story_points: task.story_points,
          status: 'todo',
          priority: 'medium',
          assignee_id: task.assignee_id || null,
          team_id: teamId || null,
        })),
      }),
    }
  )

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.message || 'Failed to create tickets'
    )
  }

  return data
}
