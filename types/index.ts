export type TicketStatus = 'todo' | 'in_progress' | 'in_review' | 'done'

export type RiskType = 'code_aware' | 'delay' | 'burnout'

export interface ShapReason {
  reason: string
  contribution: number
}

export interface ShapExplanation {
  overall_score: number
  risk_type: RiskType
  reasons: ShapReason[]
}

export interface LinkedPR {
  id: string
  number: number
  title: string
  lines_added: number
  lines_deleted: number
  test_coverage_delta: number
  review_status: 'pending' | 'approved' | 'changes_requested'
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  assignee: {
    id: string
    name: string
    avatar_url?: string
    initials: string
  }
  story_points: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  risk_score: number
  risk_type?: RiskType
  shap_explanation?: ShapExplanation
  linked_prs?: LinkedPR[]
  sprint_id: string
  sprint_name?: string
  bus_factor_note?: string
  created_at: string
  updated_at: string
}

export interface Sprint {
  id: string
  name: string
  start_date: string
  end_date: string
  current_day: number
  total_days: number
  progress_percentage: number
  is_active: boolean
}

export interface TeamMember {
  id: string
  name: string
  email: string
  avatar_url?: string
  initials: string
  role_in_team: 'lead' | 'member'
  current_workload_percentage: number
}

export type ActionItemStatus = 'pending' | 'verified_done' | 'flagged_incomplete'

export interface ActionItem {
  id: string
  meeting_id: string
  description: string
  owner_name: string
  owner_initials: string
  due_date: string
  status: ActionItemStatus
  ticket_id?: string
  commit_hash?: string
  commit_message?: string
  verification_note?: string
}

export interface TranscriptSegment {
  id: string
  timestamp: string
  speaker: string
  speaker_initials?: string
  text: string
  action_item_id?: string
}

export interface Meeting {
  id: string
  title: string
  date: string
  duration: string
  transcript: string
  transcript_segments?: TranscriptSegment[]
  action_items_count: number
  unverified_count: number
  confidence_score?: number
  audio_filename?: string
  participants?: string[]
  action_items?: ActionItem[]
}

export interface SimulationResult {
  scenario_summary: string
  baseline_median_finish: string
  scenario_median_finish: string
  baseline_probability: number
  scenario_probability: number
  histogram_data: Array<{
    date: string
    probability: number
  }>
}

export interface ProjectReport {
  week_start: string
  technical_version_text: string
  stakeholder_version_text: string
}

export interface SourceChip {
  id: string
  label: string
  type: 'ticket' | 'report' | 'meeting'
  url: string
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  source_chips?: SourceChip[]
  timestamp: string
}