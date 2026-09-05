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
  _requirements: string
): Promise<DraftTask[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return [
    {
      id: 'draft-1',
      title: 'Implement OAuth callback & JWT token exchange in FastAPI',
      description:
        'Handle GitHub OAuth redirect, verify state parameter, exchange code for access token, and issue signed JWT session cookie.',
      story_points: 5,
      is_included: true,
      suggested_developer: 'Aditi Sharma',
    },
    {
      id: 'draft-2',
      title: 'Database schema migration for risk_scores table with RLS policies',
      description:
        'Create PostgreSQL migration adding shap_explanation JSONB column and Row-Level Security policy for lead-only burnout view.',
      story_points: 3,
      is_included: true,
      suggested_developer: 'Meera Iyer',
    },
    {
      id: 'draft-3',
      title: 'Build Recharts probability histogram for Monte Carlo simulation',
      description:
        'Frontend component with color gradient #818CF8 to #4F46E5 rendering finish date probabilities.',
      story_points: 5,
      is_included: true,
      suggested_developer: 'Rohan Verma',
    },
    {
      id: 'draft-4',
      title: 'Setup automated closed-loop action item verification webhook',
      description:
        'Ingest meeting transcripts via Whisper API and match extracted action items against recent Git commits.',
      story_points: 8,
      is_included: true,
      suggested_developer: 'Kabir Mehta',
    },
  ]
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
  const response = await fetch('http://localhost:5000/api/sprints', {
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
  const response = await fetch('http://localhost:5000/api/tickets', {
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