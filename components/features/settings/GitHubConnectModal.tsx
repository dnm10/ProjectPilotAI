'use client'

import React, { useState, useEffect } from 'react'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useConnectGitHub } from '@/hooks/useIntegrations'
import {
  X,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  KeyRound,
  GitBranch,
} from 'lucide-react'
import { toast } from '@/lib/toast'

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function GitHubConnectModal() {
  const { isGitHubModalOpen, closeGitHubModal } = useSettingsStore()
  const { mutateAsync: connectGitHubMutation, isPending } = useConnectGitHub()

  const [repoUrl, setRepoUrl] = useState('https://github.com/dnm10/ProjectPilotAI')
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!isGitHubModalOpen) {
      setRepoUrl('https://github.com/dnm10/ProjectPilotAI')
      setToken('')
      setShowToken(false)
      setError(null)
      setIsSuccess(false)
    }
  }, [isGitHubModalOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isGitHubModalOpen && !isPending) {
        closeGitHubModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isGitHubModalOpen, isPending, closeGitHubModal])

  if (!isGitHubModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!repoUrl.trim()) {
      setError('Please provide a repository URL or path.')
      return
    }
    if (!token.trim()) {
      setError('Please enter your GitHub Personal Access Token (PAT).')
      return
    }

    setError(null)
    try {
      await connectGitHubMutation({ repoUrl, token })
      setIsSuccess(true)
      toast.success('GitHub repository connected successfully', 'Webhooks Active')
      setTimeout(() => {
        closeGitHubModal()
      }, 900)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to authenticate with GitHub.'
      setError(msg)
      toast.error(msg, 'Connection Failed')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1F3864] text-white flex items-center justify-center shadow-xs">
              <GitHubIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0F172A]">Connect GitHub Repository</h3>
              <p className="text-[12px] text-[#64748B]">Telemetry, PR tracking, and commit risk analysis</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeGitHubModal}
            disabled={isPending}
            className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-[16px] font-bold text-[#0F172A]">GitHub Connected!</h4>
              <p className="text-[13px] text-[#64748B]">
                Repository webhooks and PR analysis pipelines are now active.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Permission callout */}
              <div className="flex items-start gap-2.5 p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[12px] text-slate-700">
                <ShieldCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0F172A]">Required Scopes: </span>
                  Ensure your Personal Access Token has <code className="font-mono text-[#4F46E5] font-semibold bg-indigo-100/70 px-1 py-0.5 rounded">repo</code>, <code className="font-mono text-[#4F46E5] font-semibold bg-indigo-100/70 px-1 py-0.5 rounded">read:org</code>, and <code className="font-mono text-[#4F46E5] font-semibold bg-indigo-100/70 px-1 py-0.5 rounded">workflow</code> scopes enabled.
                </div>
              </div>

              {/* Repo URL Input */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-semibold text-[#0F172A]">
                  Repository URL or Path
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/organization/repository"
                    className="w-full pl-10 pr-3.5 py-2.5 text-[13px] bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-[#0F172A] placeholder-[#94A3B8]"
                  />
                </div>
              </div>

              {/* PAT Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[12px] font-semibold text-[#0F172A]">
                    Personal Access Token (PAT)
                  </label>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#4F46E5] hover:underline flex items-center gap-1"
                  >
                    <span>Generate on GitHub</span>
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full pl-10 pr-10 py-2.5 text-[13px] bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-[#0F172A] placeholder-[#94A3B8] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#0F172A]"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error feedback */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={closeGitHubModal}
                  disabled={isPending}
                  className="px-4 py-2 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-[#1F3864] hover:bg-[#16294a] disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Connect Repository</span>
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
