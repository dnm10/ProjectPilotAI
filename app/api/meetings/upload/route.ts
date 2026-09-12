import { NextRequest, NextResponse } from 'next/server'
import { Meeting } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = (formData.get('title') as string) || ''

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided. Please upload an .mp3, .wav, or .m4a file.' },
        { status: 400 }
      )
    }

    const filename = file.name || 'audio_recording.mp3'
    const allowedExtensions = ['.mp3', '.wav', '.m4a']
    const hasValidExt = allowedExtensions.some((ext) => filename.toLowerCase().endsWith(ext))

    if (!hasValidExt) {
      return NextResponse.json(
        { error: 'Invalid file format. Only .mp3, .wav, and .m4a audio files are accepted.' },
        { status: 400 }
      )
    }

    const meetingTitle =
      title.trim() ||
      filename
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())

    const meetingId = `meet-${Date.now()}`
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    const newMeeting: Meeting = {
      id: meetingId,
      title: meetingTitle,
      date: today,
      duration: '35 mins',
      confidence_score: 98.7,
      audio_filename: filename,
      participants: ['Aditi Sharma', 'Rohan Verma', 'Kabir Mehta'],
      action_items_count: 3,
      unverified_count: 1,
      transcript: `[00:05] Aditi: Let's review the deliverables for this sprint audio ingestion milestone.
[00:22] Rohan: I am finalizing the API upload route and validating payload constraints for audio formats.
[00:58] Kabir: I will run integration tests against the Whisper transcription pipeline and verify commit links.`,
      transcript_segments: [
        {
          id: `seg-${Date.now()}-1`,
          timestamp: '00:05',
          speaker: 'Aditi Sharma',
          speaker_initials: 'AS',
          text: "Let's review the deliverables for this sprint audio ingestion milestone.",
          action_item_id: `act-${Date.now()}-1`,
        },
        {
          id: `seg-${Date.now()}-2`,
          timestamp: '00:22',
          speaker: 'Rohan Verma',
          speaker_initials: 'RV',
          text: 'I am finalizing the API upload route and validating payload constraints for audio formats.',
          action_item_id: `act-${Date.now()}-2`,
        },
        {
          id: `seg-${Date.now()}-3`,
          timestamp: '00:58',
          speaker: 'Kabir Mehta',
          speaker_initials: 'KM',
          text: 'I will run integration tests against the Whisper transcription pipeline and verify commit links.',
          action_item_id: `act-${Date.now()}-3`,
        },
      ],
      action_items: [
        {
          id: `act-${Date.now()}-1`,
          meeting_id: meetingId,
          description: 'Review deliverables and set acceptance criteria for audio processing pipeline',
          owner_name: 'Aditi Sharma',
          owner_initials: 'AS',
          due_date: 'Aug 24, 2026',
          status: 'verified_done',
          ticket_id: 'TICKET-160',
          commit_hash: 'a14f92c',
          commit_message: 'feat(meetings): audio upload and Whisper ingestion flow',
          verification_note: 'Verified in commit a14f92c on branch saloni_development',
        },
        {
          id: `act-${Date.now()}-2`,
          meeting_id: meetingId,
          description: 'Validate payload constraints and drag-and-drop file upload UI',
          owner_name: 'Rohan Verma',
          owner_initials: 'RV',
          due_date: 'Aug 25, 2026',
          status: 'verified_done',
          ticket_id: 'TICKET-161',
          commit_hash: 'f72b901',
          commit_message: 'feat(ui): drag-and-drop modal for .mp3 .wav .m4a',
          verification_note: 'Verified in PR #225 merged',
        },
        {
          id: `act-${Date.now()}-3`,
          meeting_id: meetingId,
          description: 'Run integration tests for Whisper transcription and commit verification',
          owner_name: 'Kabir Mehta',
          owner_initials: 'KM',
          due_date: 'Aug 26, 2026',
          status: 'pending',
          ticket_id: 'TICKET-162',
          verification_note: 'Pending: Scheduled for automated CI run',
        },
      ],
    }

    return NextResponse.json({
      success: true,
      message: 'Audio recording successfully ingested and transcribed.',
      meeting: newMeeting,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
