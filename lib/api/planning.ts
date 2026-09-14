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

export async function generateTasksFromRequirements(
  requirements: string
): Promise<DraftTask[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/ai/generate-tasks`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requirements,
      }),
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.message || 'Failed to generate tasks with AI'
    )
  }

  const data = await response.json()

  return data.tasks
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
  tickets: DraftTask[]
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
        tickets: tickets.map((task) => ({
          title: task.title,
          description: task.description,
          story_points: task.story_points,
          status: 'todo',
          priority: 'medium',
          assignee_id: task.assignee_id || null,
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