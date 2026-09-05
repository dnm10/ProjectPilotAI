import { Meeting, ActionItem, ActionItemStatus } from '@/types'

// In-memory mock meeting store allowing live updates and uploads during the session
const mockMeetings: Meeting[] = [
  {
    id: 'meet-1',
    title: 'Sprint 3 Kickoff & Architecture Alignment',
    date: 'Aug 14, 2026',
    duration: '42 mins',
    confidence_score: 98.4,
    audio_filename: 'sprint_3_kickoff_audio.mp3',
    participants: ['Aditi Sharma', 'Rohan Verma', 'Kabir Mehta', 'Meera Rao'],
    action_items_count: 5,
    unverified_count: 1,
    transcript: `[00:02] Aditi: Let's finalize the Stripe payment webhook scope today. We need to handle payment confirmation, failed charges, and automated webhook retries.
[00:14] Rohan: I'll build the checkout UI components, hook up react-hook-form validation, and ensure error states are covered.
[00:45] Meera: I'll review the database schema migration for transaction tracking by tomorrow noon.
[01:05] Kabir: I will set up the push notification listeners for payment events and test workers by Friday.
[01:40] Aditi: Make sure we write integration tests for all webhook routes to keep test coverage above 85%.
[02:15] Kabir: I'll also verify the worker queue fallback in Redis so failed events don't get lost.`,
    transcript_segments: [
      {
        id: 'seg-1',
        timestamp: '00:02',
        speaker: 'Aditi Sharma',
        speaker_initials: 'AS',
        text: "Let's finalize the Stripe payment webhook scope today. We need to handle payment confirmation, failed charges, and automated webhook retries.",
        action_item_id: 'act-1',
      },
      {
        id: 'seg-2',
        timestamp: '00:14',
        speaker: 'Rohan Verma',
        speaker_initials: 'RV',
        text: "I'll build the checkout UI components, hook up react-hook-form validation, and ensure error states are covered.",
        action_item_id: 'act-2',
      },
      {
        id: 'seg-3',
        timestamp: '00:45',
        speaker: 'Meera Rao',
        speaker_initials: 'MR',
        text: "I'll review the database schema migration for transaction tracking by tomorrow noon.",
        action_item_id: 'act-4',
      },
      {
        id: 'seg-4',
        timestamp: '01:05',
        speaker: 'Kabir Mehta',
        speaker_initials: 'KM',
        text: 'I will set up the push notification listeners for payment events and test workers by Friday.',
        action_item_id: 'act-3',
      },
      {
        id: 'seg-5',
        timestamp: '01:40',
        speaker: 'Aditi Sharma',
        speaker_initials: 'AS',
        text: 'Make sure we write integration tests for all webhook routes to keep test coverage above 85%.',
      },
      {
        id: 'seg-6',
        timestamp: '02:15',
        speaker: 'Kabir Mehta',
        speaker_initials: 'KM',
        text: "I'll also verify the worker queue fallback in Redis so failed events don't get lost.",
        action_item_id: 'act-5',
      },
    ],
    action_items: [
      {
        id: 'act-1',
        meeting_id: 'meet-1',
        description: 'Implement Stripe webhook refund listener with idempotency support',
        owner_name: 'Aditi Sharma',
        owner_initials: 'AS',
        due_date: 'Aug 18, 2026',
        status: 'verified_done',
        ticket_id: 'TICKET-142',
        commit_hash: '9f2a81b',
        commit_message: 'feat(payments): add stripe webhook handler with idempotency',
        verification_note: 'Verified in commit 9f2a81b on branch feature/stripe',
      },
      {
        id: 'act-2',
        meeting_id: 'meet-1',
        description: 'Build checkout UI components & form validation',
        owner_name: 'Rohan Verma',
        owner_initials: 'RV',
        due_date: 'Aug 19, 2026',
        status: 'verified_done',
        ticket_id: 'TICKET-145',
        commit_hash: '3d1e704',
        commit_message: 'feat(ui): checkout modal form with validation',
        verification_note: 'Verified in PR #214 merged into main',
      },
      {
        id: 'act-3',
        meeting_id: 'meet-1',
        description: 'Setup push notification service worker for payment events',
        owner_name: 'Kabir Mehta',
        owner_initials: 'KM',
        due_date: 'Aug 18, 2026',
        status: 'flagged_incomplete',
        ticket_id: 'TICKET-149',
        verification_note: 'Flagged: 0 commits detected for push worker service by due date',
      },
      {
        id: 'act-4',
        meeting_id: 'meet-1',
        description: 'Review database schema migration for transaction tracking',
        owner_name: 'Meera Rao',
        owner_initials: 'MR',
        due_date: 'Aug 15, 2026',
        status: 'verified_done',
        commit_hash: 'c829e1f',
        verification_note: 'Verified in PR #211 review approval',
      },
      {
        id: 'act-5',
        meeting_id: 'meet-1',
        description: 'Verify worker queue fallback in Redis for event delivery',
        owner_name: 'Kabir Mehta',
        owner_initials: 'KM',
        due_date: 'Aug 22, 2026',
        status: 'pending',
        ticket_id: 'TICKET-152',
        verification_note: 'Pending: Verification scheduled for Sprint Day 8',
      },
    ],
  },
  {
    id: 'meet-2',
    title: 'Stripe Gateway & Security Review',
    date: 'Aug 16, 2026',
    duration: '28 mins',
    confidence_score: 99.1,
    audio_filename: 'stripe_security_review.wav',
    participants: ['Aditi Sharma', 'Meera Rao'],
    action_items_count: 3,
    unverified_count: 0,
    transcript: `[00:01] Meera: We need to ensure API keys are rotated in Supabase Vault and webhook signatures are strictly verified.
[00:15] Aditi: Yes, I added HMAC-SHA256 signature verification middleware to all incoming Stripe webhooks.
[00:32] Meera: Perfect. Let's document the PCI-DSS compliance scope before our next audit.`,
    transcript_segments: [
      {
        id: 'seg-201',
        timestamp: '00:01',
        speaker: 'Meera Rao',
        speaker_initials: 'MR',
        text: 'We need to ensure API keys are rotated in Supabase Vault and webhook signatures are strictly verified.',
        action_item_id: 'act-201',
      },
      {
        id: 'seg-202',
        timestamp: '00:15',
        speaker: 'Aditi Sharma',
        speaker_initials: 'AS',
        text: 'Yes, I added HMAC-SHA256 signature verification middleware to all incoming Stripe webhooks.',
        action_item_id: 'act-202',
      },
      {
        id: 'seg-203',
        timestamp: '00:32',
        speaker: 'Meera Rao',
        speaker_initials: 'MR',
        text: "Perfect. Let's document the PCI-DSS compliance scope before our next audit.",
        action_item_id: 'act-203',
      },
    ],
    action_items: [
      {
        id: 'act-201',
        meeting_id: 'meet-2',
        description: 'Rotate Stripe API keys in Supabase Vault and verify TLS 1.3 endpoints',
        owner_name: 'Meera Rao',
        owner_initials: 'MR',
        due_date: 'Aug 20, 2026',
        status: 'verified_done',
        commit_hash: 'e5b721a',
        verification_note: 'Verified in Vault config audit log #449',
      },
      {
        id: 'act-202',
        meeting_id: 'meet-2',
        description: 'Implement HMAC-SHA256 signature verification middleware for Stripe',
        owner_name: 'Aditi Sharma',
        owner_initials: 'AS',
        due_date: 'Aug 17, 2026',
        status: 'verified_done',
        commit_hash: '9f2a81b',
        verification_note: 'Verified in commit 9f2a81b middleware/stripe.ts',
      },
      {
        id: 'act-203',
        meeting_id: 'meet-2',
        description: 'Document PCI-DSS compliance scope for payment processing flow',
        owner_name: 'Meera Rao',
        owner_initials: 'MR',
        due_date: 'Aug 23, 2026',
        status: 'pending',
        verification_note: 'Pending: In documentation review stage',
      },
    ],
  },
]

export async function fetchMeetings(): Promise<Meeting[]> {
  // Simulate minimal async delay
  await new Promise((res) => setTimeout(res, 50))
  return [...mockMeetings]
}

export async function fetchMeetingById(id: string): Promise<Meeting> {
  await new Promise((res) => setTimeout(res, 50))
  const found = mockMeetings.find((m) => m.id === id)
  if (!found) {
    // Return default meet-1 if ID not found to avoid blank page
    return mockMeetings[0]
  }
  return { ...found }
}

export async function uploadMeetingAudio(formData: FormData): Promise<{ success: boolean; meeting: Meeting }> {
  const response = await fetch('/api/meetings/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to upload audio recording')
  }

  const result = await response.json()
  if (result.meeting) {
    // Add to local mock list so subsequent fetches see it immediately
    mockMeetings.unshift(result.meeting)
  }
  return result
}

export async function updateActionItemStatus(
  meetingId: string,
  actionItemId: string,
  newStatus: ActionItemStatus
): Promise<ActionItem> {
  await new Promise((res) => setTimeout(res, 80))
  const meeting = mockMeetings.find((m) => m.id === meetingId)
  if (!meeting || !meeting.action_items) {
    throw new Error('Meeting or action item not found')
  }

  const item = meeting.action_items.find((a) => a.id === actionItemId)
  if (!item) {
    throw new Error('Action item not found')
  }

  item.status = newStatus
  if (newStatus === 'verified_done') {
    item.verification_note = 'Manually verified with linked commit check'
  } else if (newStatus === 'flagged_incomplete') {
    item.verification_note = 'Flagged as incomplete by team reviewer'
  } else {
    item.verification_note = 'Pending closed-loop verification'
  }

  // Recalculate unverified count
  meeting.unverified_count = meeting.action_items.filter(
    (a) => a.status === 'flagged_incomplete' || a.status === 'pending'
  ).length

  return { ...item }
}
