import { TeamMember } from '@/types'
import { API_BASE_URL } from './config'

export const TEAM_ID_STORAGE_KEY = 'projectpilot_team_id'

export type Team = {
  id: string
  name: string
  github_repo_url: string | null
  jira_project_key: string | null
  created_by: string
  created_at: string | null
}

export type AvailableUser = {
  id: string
  full_name: string | null
  email: string | null
  role: string | null
  github_username: string | null
  jira_account_id: string | null
}

type BackendTeamMember = {
  id: string
  team_id: string
  user_id: string
  role_in_team: string | null
  joined_at: string | null
  profiles:
  | {
    id: string
    full_name: string | null
    email: string | null
    role: string | null
    github_username: string | null
    jira_account_id: string | null
  }
  | null
}

export const TEAM_STORAGE_KEY = 'projectpilot_team_members'
export const TEAM_ID_STORAGE_KEY = 'projectpilot_active_team_id'

const defaultTeamMembers: TeamMember[] = [
  {
    id: 'user-zenith',
    name: 'Team Zenith',
    email: 'lead@projectpilot.ai',
    initials: 'TZ',
    role_in_team: 'lead',
    current_workload_percentage: 65,
  },
  {
    id: 'user-aditi',
    name: 'Aditi Sharma',
    email: 'aditi@projectpilot.ai',
    initials: 'AS',
    role_in_team: 'member',
    current_workload_percentage: 85,
  },
  {
    id: 'user-rohan',
    name: 'Rohan Verma',
    email: 'rohan@projectpilot.ai',
    initials: 'RV',
    role_in_team: 'member',
    current_workload_percentage: 50,
  },
  {
    id: 'user-meera',
    name: 'Meera Iyer',
    email: 'meera@projectpilot.ai',
    initials: 'MI',
    role_in_team: 'member',
    current_workload_percentage: 70,
  },
  {
    id: 'user-kabir',
    name: 'Kabir Mehta',
    email: 'kabir@projectpilot.ai',
    initials: 'KM',
    role_in_team: 'member',
    current_workload_percentage: 92,
  },
]

let inMemoryTeam: TeamMember[] = [...defaultTeamMembers]

function loadTeam() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(TEAM_STORAGE_KEY)
      if (stored) inMemoryTeam = JSON.parse(stored)
    } catch {
      // fallback
    }
  }
}

function saveTeam() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(inMemoryTeam))
    } catch {
      // ignore
    }
  }
}

export async function fetchTeams(): Promise<Team[]> {
  const response = await fetch(`${API_BASE_URL}/api/team/list`)

  if (!response.ok) {
    throw new Error('Failed to fetch teams')
  }

  const data: {
    success: boolean
    teams: Team[]
  } = await response.json()

  return data.teams || []
}

export async function fetchTeamMembers(
  teamId?: string
): Promise<TeamMember[]> {
  let targetTeamId =
    teamId ||
    (typeof window !== 'undefined'
      ? localStorage.getItem(TEAM_ID_STORAGE_KEY)
      : null)

  // If still no team ID, fetch first team from Supabase
  if (!targetTeamId) {
    const teams = await fetchTeams().catch(() => [])
    if (teams.length > 0) {
      targetTeamId = teams[0].id
      if (typeof window !== 'undefined') {
        localStorage.setItem(TEAM_ID_STORAGE_KEY, targetTeamId)
      }
    }
  }

  if (!targetTeamId) {
    return []
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/team?team_id=${encodeURIComponent(targetTeamId)}`
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      throw new Error(
        data?.message || 'Failed to fetch team members'
      )
    }

    const members = (data?.teamMembers || []).map(
      (member: BackendTeamMember) => {
        const profile = member.profiles

        const name =
          profile?.full_name ||
          profile?.email ||
          'Team Member'

        return {
          id: member.user_id,
          name,
          email: profile?.email || '',
          initials: name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          role_in_team: member.role_in_team || 'Member',
          current_workload_percentage: 0,
        }
      }
    )

    return members
  } catch (error) {
    console.warn('Backend fetchTeamMembers failed:', error)
    return []
  }
}

export async function fetchAvailableUsers(): Promise<AvailableUser[]> {
  const response = await fetch(`${API_BASE_URL}/api/team/users`)

  if (!response.ok) {
    throw new Error('Failed to fetch available users')
  }

  const data: {
    success: boolean
    users: AvailableUser[]
  } = await response.json()

  return data.users || []
}

export async function createTeam(name: string, createdBy: string) {
  const response = await fetch(`${API_BASE_URL}/api/team`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      created_by: createdBy,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create team')
  }

  return data.team as Team
}

export async function addTeamMember(
  teamId: string,
  userId: string,
  roleInTeam: string
) {
  const response = await fetch(`${API_BASE_URL}/api/team/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      team_id: teamId,
      user_id: userId,
      role_in_team: roleInTeam,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add team member')
  }

  return data.teamMember
}

export async function updateTeam(
  teamId: string,
  name: string
): Promise<Team> {
  const response = await fetch(
    `${API_BASE_URL}/api/team/${teamId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update team')
  }

  return data.team as Team
}

export async function deleteTeam(teamId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/team/${teamId}`,
    {
      method: 'DELETE',
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete team')
  }

  return data
}

export async function updateTeamMember(
  memberId: string,
  roleInTeam: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/team/members/${memberId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role_in_team: roleInTeam,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to update team member'
    )
  }

  return data.teamMember
}

export async function removeTeamMember(memberId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/team/members/${memberId}`,
    {
      method: 'DELETE',
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to remove team member'
    )
  }

  return data
}

export async function updateTeamMemberRole(
  memberId: string,
  newRole: 'lead' | 'member'
): Promise<TeamMember> {
  try {
    await updateTeamMember(memberId, newRole)
  } catch (error) {
    console.warn('Backend updateTeamMember error:', error)
  }

  return {
    id: memberId,
    name: 'Team Member',
    email: '',
    initials: 'TM',
    role_in_team: newRole,
    current_workload_percentage: 0,
  }
}
