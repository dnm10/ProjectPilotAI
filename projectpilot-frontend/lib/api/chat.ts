import { ChatMessage } from '@/types'

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: "Hello! I'm your ProjectPilot AI assistant. I have indexed your Sprint 3 board, Git commit history, and latest meeting notes. Ask me anything about risk bottlenecks, ticket statuses, or team workload.",
    timestamp: '10:00 AM',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Which tickets have the highest risk of delaying our sprint delivery?',
    timestamp: '10:02 AM',
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    text: 'Currently, **TICKET-142 (Payment Gateway Integration)** has the highest risk score at **78%**. The primary blockers are: no commits in the last 3 days, a single developer touching the file, and PR #212 adding 640 lines with zero unit tests. Additionally, **TICKET-156** has been reopened 4 times due to changing requirements.',
    timestamp: '10:02 AM',
    source_chips: [
      {
        id: 'c1',
        label: 'TICKET-142 (Stripe Gateway)',
        type: 'ticket',
        url: '/tickets/TICKET-142',
      },
      {
        id: 'c2',
        label: 'TICKET-156 (Checkout)',
        type: 'ticket',
        url: '/tickets/TICKET-142',
      },
      {
        id: 'c3',
        label: 'Risk Overview Table',
        type: 'report',
        url: '/risk',
      },
    ],
  },
]

export async function fetchChatHistory(): Promise<ChatMessage[]> {
  return INITIAL_MESSAGES
}

export async function sendChatMessage(userText: string): Promise<ChatMessage> {
  // Simulate RAG vector retrieval & LLM generation delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const lower = userText.toLowerCase()

  if (lower.includes('workload') || lower.includes('aditi') || lower.includes('capacity')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: 'Aditi Sharma is currently allocated at **82% capacity** (13 story points across 3 active tickets). She has recorded late-night commits over the past 3 days. Recommend reassigning part of the checkout flow to Rohan Verma (currently at 58% capacity).',
      timestamp: 'Just now',
      source_chips: [
        { id: 'c4', label: 'Workload Overview', type: 'report', url: '/workload' },
        { id: 'c5', label: 'TICKET-142', type: 'ticket', url: '/tickets/TICKET-142' },
      ],
    }
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: `Based on your repository telemetry and Sprint 3 data: "${userText}" is on track. Sprint velocity is currently at 64% with 4 days remaining before the sprint deadline on Aug 24.`,
    timestamp: 'Just now',
    source_chips: [
      { id: 'c6', label: 'Sprint 3 Board', type: 'ticket', url: '/sprints/board' },
      { id: 'c7', label: 'Sprint Planner', type: 'report', url: '/sprints/plan' },
    ],
  }
}