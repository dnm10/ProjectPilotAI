import { ProjectReport } from '@/types'

export interface ReportWeekOption {
  weekStart: string
  label: string
  sprintName: string
}

const mockWeeklyReports: ProjectReport[] = [
  {
    week_start: '2026-08-19',
    label: 'Week of Aug 19, 2026',
    title: 'Sprint 3 Executive & Technical Briefing',
    sprint_name: 'Sprint 3 (Aug 14–24)',
    key_metrics: {
      velocity_completion: 64,
      on_time_probability: 81,
      high_risk_tickets_count: 3,
      prs_merged_count: 7,
    },
    technical_version_text: `### 1. Sprint Health & Velocity Telemetry
Velocity is currently tracking at 64% completion on Day 6 of 10. Across the current active sprint, 13 story points have been closed across 7 merged Pull Requests. CI test suite execution runtime is averaging 3m 42s across all integration pipelines.

### 2. Risk Radar & Code-Aware Bottlenecks
• TICKET-142 (Payment Gateway Integration): Elevated cyclomatic complexity detected in Stripe webhook handlers. PR #212 added 640 lines of code with zero new unit test assertions, resulting in a risk score of 78%.
• TICKET-149 (Push Notification Service): PR review has been pending for 3 consecutive days. Kabir Mehta currently holds 3 concurrent tickets, creating a temporary workload bottleneck.
• Bus Factor Alert: payment_service.py has only ever been authored and modified by Aditi Sharma.

### 3. Engineering Recommendations
1. Allocate 1 full engineering day for Meera Rao to pair with Aditi on integration tests for the Stripe webhook failure modes before merging PR #212.
2. Rebalance push worker queue ticket TICKET-149 to Rohan Verma to alleviate Kabir's concurrent work in flight.
3. Enforce 80% coverage threshold check in GitHub Actions for all payment module PRs.`,
    stakeholder_version_text: `### 1. Executive Summary & Delivery Health
The engineering team is making steady progress toward the planned August 24 milestone release. Core user onboarding, account provisioning, and project dashboard features have passed QA validation and are ready for production.

### 2. Milestone Forecast & On-Time Probability
Our predictive project model estimates an 81% probability of on-time sprint completion with current team capacity and velocity. Release readiness currently scores 74/100, which aligns with standard mid-sprint trajectories.

### 3. Key Deliverables & Next Steps
• Payment Processing: Stripe checkout and billing portal integration are scheduled for staging deployment this Friday.
• Security & Stability: Proactive code reviews are underway to ensure payment webhook reliability and fault tolerance.
• Next Milestone: End-to-end sandbox walkthrough scheduled for Monday morning with product and finance leads.`,
  },
  {
    week_start: '2026-08-12',
    label: 'Week of Aug 12, 2026',
    title: 'Sprint 2 Retrospective & Sprint 3 Launch Briefing',
    sprint_name: 'Sprint 2 (Aug 4–14)',
    key_metrics: {
      velocity_completion: 92,
      on_time_probability: 94,
      high_risk_tickets_count: 1,
      prs_merged_count: 12,
    },
    technical_version_text: `### 1. Sprint 2 Retrospective & Throughput Analysis
Sprint 2 concluded with 92% story point attainment (38 of 41 points burned). The team successfully merged 12 PRs. Latency profiling on authentication middleware showed p99 response times dropped from 140ms to 28ms following Redis token caching.

### 2. Architecture & Database Migrations
• PostgreSQL schema migration 004 (Transaction ledger & audit trail) successfully applied without downtime.
• Supabase Vault integration verified for all third-party API keys and secret rotation policies.
• Automated dead-letter queue implemented for asynchronous worker tasks.

### 3. Technical Debt & Sprint 3 Carryover
One minor carryover ticket (TICKET-138: Background export retry backoff) moved to Sprint 3 backlog. Test coverage across core API services improved to 84.2%.`,
    stakeholder_version_text: `### 1. Sprint 2 Accomplishments
Sprint 2 was delivered on time with a 92% completion rate against our initial sprint commitments. All core database infrastructure and security measures were finalized ahead of schedule.

### 2. Business Impact
• System performance improved significantly with sub-50 millisecond response times for user authentication.
• Security standards updated to meet enterprise compliance guidelines for credential storage.

### 3. Sprint 3 Objectives
The upcoming sprint directly focuses on revenue-driving features: Stripe billing checkout, recurring subscription management, and customer invoice generation.`,
  },
  {
    week_start: '2026-08-05',
    label: 'Week of Aug 5, 2026',
    title: 'Sprint 2 Architecture & Security Review',
    sprint_name: 'Sprint 2 (Aug 4–14)',
    key_metrics: {
      velocity_completion: 45,
      on_time_probability: 88,
      high_risk_tickets_count: 2,
      prs_merged_count: 5,
    },
    technical_version_text: `### 1. Architecture Overview & API Contracts
The team completed the OpenAPI 3.0 specification for all public and internal service endpoints. REST API contracts for ticket lifecycle transitions and audit logging have been agreed upon across frontend and backend modules.

### 2. Code Quality & Linting Rules
• ESLint and Prettier strict formatting rules unified across the repository.
• TypeScript strict mode enabled with zero implicit 'any' allowances in data access layers.

### 3. Infrastructure & CI/CD Pipelines
Cloud Build triggers configured to run automated unit test suites and container vulnerability scanning on every PR against the main branch.`,
    stakeholder_version_text: `### 1. Strategic Architecture Update
Foundational system architecture and security protocols have been established. The technical foundation is now structured to support high scalability and rapid feature delivery.

### 2. Project Timeline & Budget
Development remains strictly on schedule and within planned resource allocation. The team is on track to initiate billing features in the following sprint.`,
  },
]

export async function fetchAvailableWeeks(): Promise<ReportWeekOption[]> {
  await new Promise((res) => setTimeout(res, 40))
  return mockWeeklyReports.map((r) => ({
    weekStart: r.week_start,
    label: r.label || r.week_start,
    sprintName: r.sprint_name || 'Sprint',
  }))
}

export async function fetchReport(weekStart: string): Promise<ProjectReport> {
  await new Promise((res) => setTimeout(res, 60))
  const report = mockWeeklyReports.find((r) => r.week_start === weekStart)
  if (!report) {
    return mockWeeklyReports[0]
  }
  return { ...report }
}
