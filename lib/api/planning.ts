import { API_BASE_URL } from './config'

export interface DraftTask {
  id: string
  title: string
  description: string
  story_points: number
  is_included: boolean
  suggested_developer?: string
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
  tasks: DraftTask[]
): Promise<DeveloperSchedule[]> {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  return [
    {
      developer_name: 'Aditi Sharma',
      role: 'Lead Backend',
      assigned_points: 5,
      estimated_days: 3,
      assigned_tasks_count: 1,
    },
    {
      developer_name: 'Meera Iyer',
      role: 'Database & Auth',
      assigned_points: 3,
      estimated_days: 2,
      assigned_tasks_count: 1,
    },
    {
      developer_name: 'Rohan Verma',
      role: 'Frontend UI',
      assigned_points: 5,
      estimated_days: 3,
      assigned_tasks_count: 1,
    },
    {
      developer_name: 'Kabir Mehta',
      role: 'AI / ML Integrations',
      assigned_points: 8,
      estimated_days: 5,
      assigned_tasks_count: 1,
    },
  ]
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
  const response = await fetch(`${API_BASE_URL}/api/sprints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sprintData),
  })

  if (!response.ok) {
    throw new Error('Failed to create sprint')
  }

  return response.json()
}

export async function createTickets(
  sprintId: string,
  tickets: DraftTask[]
) {
  const response = await fetch(`${API_BASE_URL}/api/tickets`, {
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
      })),
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create tickets')
  }

  return response.json()
}