'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMeetingModalStore } from '@/store/useMeetingModalStore'
import { useUploadRecording } from '@/hooks/useMeetings'
import {
  X,
  Upload,
  FileAudio,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Music,
} from 'lucide-react'
import { toast } from '@/lib/toast'

export default function UploadModal() {
  const { isUploadModalOpen, closeUploadModal } = useMeetingModalStore()
  const router = useRouter()
  const { mutateAsync: uploadRecording, isPending } = useUploadRecording()

  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMeetingId, setSuccessMeetingId] = useState<string | null>(null)
  const [uploadPhase, setUploadPhase] = useState<'idle' | 'uploading' | 'transcribing' | 'done'>('idle')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isUploadModalOpen) {
      setSelectedFile(null)
      setTitle('')
      setError(null)
      setSuccessMeetingId(null)
      setUploadPhase('idle')
      setDragActive(false)
    }
  }, [isUploadModalOpen])

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isUploadModalOpen && !isPending) {
        closeUploadModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isUploadModalOpen, isPending, closeUploadModal])

  if (!isUploadModalOpen) return null

  const allowedExtensions = ['.mp3', '.wav', '.m4a']

  const validateAndSetFile = (file: File) => {
    setError(null)
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!allowedExtensions.includes(ext)) {
      setError(`Invalid file format. Please upload an .mp3, .wav, or .m4a file. (Received ${file.name})`)
      return
    }

    // Max 100MB limit check
    if (file.size > 100 * 1024 * 1024) {
      setError('File size exceeds 100 MB limit.')
      return
    }

    setSelectedFile(file)
    if (!title) {
      // Auto-populate title from filename
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
      setTitle(cleanName)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Please select an audio file to upload.')
      return
    }

    setError(null)
    setUploadPhase('uploading')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', title)

      // Simulate Whisper pipeline status transitions
      setTimeout(() => {
        setUploadPhase('transcribing')
      }, 700)

      const result = await uploadRecording(formData)
      setUploadPhase('done')
      setSuccessMeetingId(result.meeting.id)
      toast.success('Meeting recording uploaded and transcribed successfully', 'Whisper AI Ingestion')
    } catch (err: unknown) {
      setUploadPhase('idle')
      const msg = err instanceof Error ? err.message : 'Failed to ingest audio recording.'
      setError(msg)
      toast.error(msg, 'Upload Failed')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center border border-indigo-100">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0F172A]">Upload Meeting Recording</h3>
              <p className="text-[12px] text-[#64748B]">Whisper AI transcription &amp; action extraction</p>
            </div>
          </div>

          <button
            onClick={closeUploadModal}
            disabled={isPending}
            className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {successMeetingId ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-[16px] font-bold text-[#0F172A]">Audio Ingestion Complete!</h4>
                <p className="text-[13px] text-[#64748B] mt-1">
                  Whisper AI transcribed the audio with high confidence and generated closed-loop action items.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  className="px-4 py-2 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeUploadModal()
                    router.push(`/meetings/${successMeetingId}`)
                  }}
                  className="px-4 py-2 text-[13px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg shadow-sm transition-colors"
                >
                  View Transcript &amp; Checklist
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  dragActive
                    ? 'border-[#4F46E5] bg-indigo-50/50 scale-[0.99]'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-[#CBD5E1] hover:border-[#4F46E5] hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp3,.wav,.m4a,audio/mp3,audio/wav,audio/x-m4a,audio/m4a"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FileAudio className="w-5 h-5" />
                    </div>
                    <div className="max-w-full px-2">
                      <p className="text-[13px] font-semibold text-[#0F172A] truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-[#64748B]">
                        {formatFileSize(selectedFile.size)} &bull; Click or drop another file to replace
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#0F172A]">
                        Drag &amp; drop audio recording here
                      </p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Supports <span className="font-mono text-[#4F46E5] font-semibold">.mp3</span>,{' '}
                        <span className="font-mono text-[#4F46E5] font-semibold">.wav</span>,{' '}
                        <span className="font-mono text-[#4F46E5] font-semibold">.m4a</span> (Up to 100MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">
                  Meeting Title / Topic
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sprint 3 Architecture & Payments Sync"
                  className="w-full px-3.5 py-2 text-[13px] bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-[#0F172A] placeholder-[#94A3B8]"
                />
              </div>

              {/* Processing or Error Feedback */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {uploadPhase !== 'idle' && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[12px] font-medium text-[#4F46E5]">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      {uploadPhase === 'uploading'
                        ? 'Uploading audio payload to /api/meetings/upload...'
                        : 'Running Whisper AI transcription & commit extractor...'}
                    </span>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-[#4F46E5] transition-all duration-500 rounded-full ${
                        uploadPhase === 'uploading' ? 'w-1/2' : 'w-5/6'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={isPending}
                  className="px-4 py-2 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !selectedFile}
                  className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Audio...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Ingest &amp; Transcribe</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
