import { TeamMember } from '@/types'

const TEAM_STORAGE_KEY = 'projectpilot_team_members'

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

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  loadTeam()
  return [...inMemoryTeam]
}

export async function updateTeamMemberRole(
  memberId: string,
  newRole: 'lead' | 'member'
): Promise<TeamMember> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  loadTeam()
  
  const index = inMemoryTeam.findIndex((m) => m.id === memberId)
  if (index === -1) {
    throw new Error(`Team member with ID ${memberId} not found`)
  }

  inMemoryTeam[index] = {
    ...inMemoryTeam[index],
    role_in_team: newRole,
  }

  saveTeam()
  return inMemoryTeam[index]
}
