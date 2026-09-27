import { Ticket } from '@/types'

export interface RiskTableRow extends Ticket {
  top_reason: string
}

const ALL_RISK_ITEMS: RiskTableRow[] = [
  {
    id: 'TICKET-142',
    title: 'Payment Gateway Integration',
    description: 'Integrate Stripe gateway, webhook listeners, and refund flows.',
    status: 'in_progress',
    assignee: { id: 'usr-1', name: 'Aditi Sharma', initials: 'AS' },
    story_points: 8,
    priority: 'high',
    risk_score: 78,
    risk_type: 'code_aware',
    top_reason: 'No commits in 3 days; only 1 dev knows this file; PR #212 has 0 tests',
    sprint_id: 'sprint-3',
    created_at: 'Aug 14, 2026',
    updated_at: '14 min ago',
    shap_explanation: {
      overall_score: 78,
      risk_type: 'code_aware',
      reasons: [
        { reason: 'No commits on this ticket in 3 days', contribution: 29 },
        { reason: 'Only 1 developer has ever touched payment_service.py', contribution: 24 },
        { reason: 'PR #212 adds 640 lines with zero new tests', contribution: 18 },
        { reason: 'Sprint velocity down 15% vs. last 3 sprints', contribution: 7 },
      ],
    },
  },
  {
    id: 'TICKET-156',
    title: 'Checkout Flow Redesign',
    description: 'Multi-step cart checkout with address auto-complete.',
    status: 'in_progress',
    assignee: { id: 'usr-2', name: 'Rohan Verma', initials: 'RV' },
    story_points: 5,
    priority: 'high',
    risk_score: 71,
    risk_type: 'delay',
    top_reason: 'Reopened 4 times; requirements still changing',
    sprint_id: 'sprint-3',
    created_at: 'Aug 15, 2026',
    updated_at: '32 min ago',
    shap_explanation: {
      overall_score: 71,
      risk_type: 'delay',
      reasons: [
        { reason: 'Ticket reopened 4 times in current sprint', contribution: 38 },
        { reason: 'Requirement scope modified after sprint kickoff', contribution: 21 },
        { reason: 'Downstream dependency on Stripe API pending', contribution: 12 },
      ],
    },
  },
  {
    id: 'PR #212',
    title: 'Add Stripe payment service',
    description: 'Core payment processing backend service.',
    status: 'in_review',
    assignee: { id: 'usr-1', name: 'Aditi Sharma', initials: 'AS' },
    story_points: 5,
    priority: 'high',
    risk_score: 74,
    risk_type: 'code_aware',
    top_reason: '640 lines changed; zero new tests added',
    sprint_id: 'sprint-3',
    created_at: 'Aug 16, 2026',
    updated_at: '1 hr ago',
    shap_explanation: {
      overall_score: 74,
      risk_type: 'code_aware',
      reasons: [
        { reason: '640 lines added with zero unit tests', contribution: 45 },
        { reason: 'High cyclomatic complexity in webhook dispatcher', contribution: 29 },
      ],
    },
  },
  {
    id: 'TICKET-149',
    title: 'Push Notification Service',
    description: 'Web push notification service worker.',
    status: 'in_review',
    assignee: { id: 'usr-4', name: 'Kabir Mehta', initials: 'KM' },
    story_points: 5,
    priority: 'medium',
    risk_score: 52,
    risk_type: 'delay',
    top_reason: 'Review pending 3 days; assignee overloaded',
    sprint_id: 'sprint-3',
    created_at: 'Aug 16, 2026',
    updated_at: '3 hr ago',
    shap_explanation: {
      overall_score: 52,
      risk_type: 'delay',
      reasons: [
        { reason: 'Pull request waiting for review > 72 hours', contribution: 31 },
        { reason: 'Assignee assigned to 3 parallel high-priority tickets', contribution: 21 },
      ],
    },
  },
  {
    id: 'Meera Iyer',
    title: 'Workload signal — late-night commit surge',
    description: 'Automated developer wellbeing and burnout risk check.',
    status: 'in_progress',
    assignee: { id: 'usr-3', name: 'Meera Iyer', initials: 'MI' },
    story_points: 0,
    priority: 'medium',
    risk_score: 48,
    risk_type: 'burnout',
    top_reason: 'Visible to team lead only — see Workload page',
    sprint_id: 'sprint-3',
    created_at: 'Aug 17, 2026',
    updated_at: '5 hr ago',
    shap_explanation: {
      overall_score: 48,
      risk_type: 'burnout',
      reasons: [
        { reason: '3 consecutive days with commits past 11:30 PM', contribution: 28 },
        { reason: 'Velocity surge exceeding 140% historical average', contribution: 20 },
      ],
    },
  },
  {
    id: 'TICKET-138',
    title: 'User Profile Page',
    description: 'Standard profile edit and display component.',
    status: 'done',
    assignee: { id: 'usr-2', name: 'Rohan Verma', initials: 'RV' },
    story_points: 3,
    priority: 'low',
    risk_score: 22,
    risk_type: 'delay',
    top_reason: 'On track; normal commit pace',
    sprint_id: 'sprint-3',
    created_at: 'Aug 14, 2026',
    updated_at: '6 hr ago',
    shap_explanation: {
      overall_score: 22,
      risk_type: 'delay',
      reasons: [
        { reason: 'Normal commit frequency and PR turnaround', contribution: 22 },
      ],
    },
  },
]

export async function fetchAllRiskScores(filterType: string): Promise<RiskTableRow[]> {
  if (filterType === 'all') return ALL_RISK_ITEMS
  if (filterType === 'code_aware') {
    return ALL_RISK_ITEMS.filter((item) => item.risk_type === 'code_aware')
  }
  if (filterType === 'delay') {
    return ALL_RISK_ITEMS.filter((item) => item.risk_type === 'delay')
  }
  if (filterType === 'sprint-3') {
    return ALL_RISK_ITEMS.filter((item) => item.sprint_id === 'sprint-3')
  }
  return ALL_RISK_ITEMS
}