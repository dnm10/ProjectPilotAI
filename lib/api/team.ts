import { TeamMember } from '@/types'
import { API_BASE_URL } from './config'

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

export async function fetchTeams(): Promise<Team[]> {
  const response = await fetch(`${API_BASE_URL}/api/team/list`)

  if (!response.ok) {
    throw new Error('Failed to fetch teams')
  }

  const data: {
    success: boolean
    teams: Team[]
  } = await response.json()

  return data.teams
}

export async function fetchTeamMembers(
  teamId: string
): Promise<TeamMember[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/team?team_id=${encodeURIComponent(teamId)}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch team members')
  }

  const data: {
    success: boolean
    teamMembers: BackendTeamMember[]
  } = await response.json()

  return data.teamMembers.map((member) => {
    const profile = member.profiles
    const name = profile?.full_name || profile?.email || 'Unknown User'

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
  })
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

  return data.users
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