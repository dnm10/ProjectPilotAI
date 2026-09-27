import { Ticket } from '@/types'

export async function fetchTicketById(id: string): Promise<Ticket> {
  return {
    id: id || 'TICKET-142',
    title: 'Payment Gateway Integration',
    description:
      'Integrate the Stripe payment gateway for checkout, including webhook handling for payment confirmation and refund flows. Must support INR and USD. Acceptance criteria: unit tests for success/failure/timeout paths, and a sandbox demo before merge.',
    status: 'in_progress',
    assignee: {
      id: 'usr-1',
      name: 'Aditi Sharma',
      initials: 'AS',
    },
    story_points: 8,
    priority: 'high',
    risk_score: 78,
    risk_type: 'code_aware',
    bus_factor_note: 'Only Aditi understands this module',
    created_at: 'Aug 14, 2026',
    updated_at: 'Just now',
    sprint_id: 'sprint-3',
    sprint_name: 'Sprint 3 (Aug 14–24)',
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
    linked_prs: [
      {
        id: 'pr-212',
        number: 212,
        title: 'Add Stripe payment service',
        lines_added: 640,
        lines_deleted: 12,
        test_coverage_delta: 0,
        review_status: 'pending',
      },
    ],
  }
}