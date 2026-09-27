import {
  DeveloperWorkload,
  CommitActivity,
  PRTurnaround,
  BurnoutSignal,
} from '@/types'

const defaultTeamWorkload: DeveloperWorkload[] = [
  {
    id: 'dev-1',
    name: 'Aditi Sharma',
    role: 'Lead Backend',
    email: 'aditi@projectpilot.ai',
    initials: 'AS',
    workload_percentage: 82,
    story_points: 13,
    assigned_tickets_count: 4,
    is_overloaded: true,
  },
  {
    id: 'dev-2',
    name: 'Kabir Mehta',
    role: 'AI Engineer',
    email: 'kabir@projectpilot.ai',
    initials: 'KM',
    workload_percentage: 63,
    story_points: 8,
    assigned_tickets_count: 2,
    is_overloaded: false,
  },
  {
    id: 'dev-3',
    name: 'Rohan Verma',
    role: 'Frontend UI',
    email: 'rohan@projectpilot.ai',
    initials: 'RV',
    workload_percentage: 58,
    story_points: 8,
    assigned_tickets_count: 3,
    is_overloaded: false,
  },
  {
    id: 'dev-4',
    name: 'Meera Iyer',
    role: 'Database & Auth',
    email: 'meera@projectpilot.ai',
    initials: 'MI',
    workload_percentage: 45,
    story_points: 5,
    assigned_tickets_count: 2,
    is_overloaded: false,
  },
]

const developerCommitsMap: Record<string, CommitActivity[]> = {
  'dev-1': [
    {
      id: 'c-101',
      hash: 'a8f3b92',
      message: 'feat(payments): Stripe webhook retry logic and idempotency key',
      timestamp: '2 hours ago',
      branch: 'feature/stripe-gateway',
      lines_added: 142,
      lines_deleted: 18,
    },
    {
      id: 'c-102',
      hash: '9d2e1c4',
      message: 'fix(auth): handle expired refresh token race condition',
      timestamp: 'Yesterday at 11:45 PM',
      branch: 'fix/token-refresh',
      lines_added: 38,
      lines_deleted: 12,
    },
    {
      id: 'c-103',
      hash: '3f7a810',
      message: 'refactor(api): add database connection pool health checks',
      timestamp: '2 days ago',
      branch: 'main',
      lines_added: 89,
      lines_deleted: 44,
    },
    {
      id: 'c-104',
      hash: 'b14c99a',
      message: 'chore(deps): bump fastapi to 0.111.0 and pydantic v2',
      timestamp: '3 days ago',
      branch: 'chore/deps-bump',
      lines_added: 24,
      lines_deleted: 19,
    },
  ],
  'dev-2': [
    {
      id: 'c-201',
      hash: '7c4d11e',
      message: 'feat(ai): optimize Whisper transcript chunking for long audio files',
      timestamp: '4 hours ago',
      branch: 'feature/whisper-chunking',
      lines_added: 215,
      lines_deleted: 32,
    },
    {
      id: 'c-202',
      hash: '5a89f02',
      message: 'test(eval): add golden evaluation dataset for action items',
      timestamp: '1 day ago',
      branch: 'eval/action-items',
      lines_added: 180,
      lines_deleted: 10,
    },
  ],
  'dev-3': [
    {
      id: 'c-301',
      hash: '4e29ab7',
      message: 'feat(ui): implement audience-aware report prose toggle',
      timestamp: '3 hours ago',
      branch: 'feature/reports-view',
      lines_added: 320,
      lines_deleted: 45,
    },
    {
      id: 'c-302',
      hash: '1b88df0',
      message: 'style(dashboard): polish navy sidebar and topbar responsive layout',
      timestamp: '1 day ago',
      branch: 'polish/shell',
      lines_added: 75,
      lines_deleted: 22,
    },
  ],
  'dev-4': [
    {
      id: 'c-401',
      hash: '8f12cc5',
      message: 'migration(db): add row-level security policy for lead-only tables',
      timestamp: '5 hours ago',
      branch: 'migration/rls-policies',
      lines_added: 94,
      lines_deleted: 6,
    },
    {
      id: 'c-402',
      hash: '6d41aa9',
      message: 'perf(queries): add composite index on sprint_id and status',
      timestamp: '2 days ago',
      branch: 'perf/indexes',
      lines_added: 42,
      lines_deleted: 14,
    },
  ],
}

const developerPRTurnaroundMap: Record<string, PRTurnaround> = {
  'dev-1': {
    avg_review_hours: 2.8,
    prs_reviewed_count: 14,
    avg_time_to_merge_hours: 18.5,
    turnaround_rating: 'fast',
  },
  'dev-2': {
    avg_review_hours: 4.5,
    prs_reviewed_count: 8,
    avg_time_to_merge_hours: 24.0,
    turnaround_rating: 'fast',
  },
  'dev-3': {
    avg_review_hours: 5.2,
    prs_reviewed_count: 11,
    avg_time_to_merge_hours: 21.0,
    turnaround_rating: 'moderate',
  },
  'dev-4': {
    avg_review_hours: 3.6,
    prs_reviewed_count: 9,
    avg_time_to_merge_hours: 16.0,
    turnaround_rating: 'fast',
  },
}

const defaultBurnoutSignals: BurnoutSignal[] = [
  {
    id: 'burnout-1',
    developer_id: 'dev-1',
    developer_name: 'Aditi Sharma',
    initials: 'AS',
    role: 'Lead Backend',
    burnout_score: 84,
    risk_level: 'high',
    reasons: [
      {
        reason: '3 late-night commits pushed past 11:30 PM this sprint',
        contribution: 38,
      },
      {
        reason: 'Velocity surge exceeding 140% of 6-week historical baseline',
        contribution: 27,
      },
      {
        reason: 'High bus-factor concentration (Payment Service & Auth modules)',
        contribution: 19,
      },
      {
        reason: 'Zero PTO or rest buffer detected across last 6 consecutive sprints',
        contribution: 16,
      },
    ],
    last_evaluated: 'Today at 09:30 AM',
    burnout_notes:
      'High concentration of critical path tickets assigned consecutively without recovery buffer. Recommendation: Reassign Stripe refund subtask to reduce sprint load.',
  },
  {
    id: 'burnout-2',
    developer_id: 'dev-2',
    developer_name: 'Kabir Mehta',
    initials: 'KM',
    role: 'AI Engineer',
    burnout_score: 52,
    risk_level: 'medium',
    reasons: [
      {
        reason: 'Weekend commit activity detected on AI evaluation pipelines',
        contribution: 29,
      },
      {
        reason: 'Sprint story points increased by +22% over previous sprint baseline',
        contribution: 23,
      },
      {
        reason: 'Multi-tasking across 2 disparate feature branches simultaneously',
        contribution: 18,
      },
    ],
    last_evaluated: 'Yesterday at 04:15 PM',
    burnout_notes:
      'Moderate fatigue indicator driven by weekend commit bursts. Recommendation: Monitor workload and verify async hours balance.',
  },
]

export async function fetchTeamWorkload(teamId?: string): Promise<DeveloperWorkload[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  if (teamId) {
    // If specific team ID is provided, filter or return team members
    return defaultTeamWorkload
  }
  return defaultTeamWorkload
}

export interface DeveloperDrilldownResponse {
  workload: DeveloperWorkload
  commits: CommitActivity[]
  prTurnaround: PRTurnaround
}

export async function fetchDeveloperDrilldown(
  developerId: string
): Promise<DeveloperDrilldownResponse> {
  await new Promise((resolve) => setTimeout(resolve, 350))

  const workload =
    defaultTeamWorkload.find((d) => d.id === developerId) || defaultTeamWorkload[0]
  const commits = developerCommitsMap[developerId] || developerCommitsMap['dev-1']
  const prTurnaround =
    developerPRTurnaroundMap[developerId] || developerPRTurnaroundMap['dev-1']

  return {
    workload,
    commits,
    prTurnaround,
  }
}

export async function fetchBurnoutSignals(teamId?: string): Promise<BurnoutSignal[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  if (teamId) {
    return defaultBurnoutSignals
  }
  return defaultBurnoutSignals
}
