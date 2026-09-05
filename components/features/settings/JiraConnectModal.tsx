'use client'

import React, { useState, useEffect } from 'react'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useConnectJira } from '@/hooks/useIntegrations'
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
  Globe,
  FolderKanban,
} from 'lucide-react'
import { toast } from '@/lib/toast'

export default function JiraConnectModal() {
  const { isJiraModalOpen, closeJiraModal } = useSettingsStore()
  const { mutateAsync: connectJiraMutation, isPending } = useConnectJira()

  const [domain, setDomain] = useState('zenith-pilot.atlassian.net')
  const [projectKey, setProjectKey] = useState('ZENITH-BOARD (Sprint 3)')
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!isJiraModalOpen) {
      setDomain('zenith-pilot.atlassian.net')
      setProjectKey('ZENITH-BOARD (Sprint 3)')
      setToken('')
      setShowToken(false)
      setError(null)
      setIsSuccess(false)
    }
  }, [isJiraModalOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isJiraModalOpen && !isPending) {
        closeJiraModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isJiraModalOpen, isPending, closeJiraModal])

  if (!isJiraModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain.trim()) {
      setError('Please provide your Atlassian workspace domain.')
      return
    }
    if (!token.trim()) {
      setError('Please enter your Jira API token.')
      return
    }

    setError(null)
    try {
      await connectJiraMutation({ domain, projectKey, token })
      setIsSuccess(true)
      toast.success('Jira workspace connected successfully', 'Sprint Sync Active')
      setTimeout(() => {
        closeJiraModal()
      }, 900)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to authenticate with Jira.'
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
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              Jira
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0F172A]">Connect Jira Workspace</h3>
              <p className="text-[12px] text-[#64748B]">Sprint backlogs, tickets, and burndown tracking</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeJiraModal}
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
              <h4 className="text-[16px] font-bold text-[#0F172A]">Jira Workspace Connected!</h4>
              <p className="text-[13px] text-[#64748B]">
                Sprint boards, ticket transitions, and issue metadata are now syncing.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Permission callout */}
              <div className="flex items-start gap-2.5 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-[12px] text-slate-700">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0F172A]">Jira REST API: </span>
                  Uses secure OAuth/API Token with read &amp; webhook write permissions for sprint synchronization.
                </div>
              </div>

              {/* Atlassian Domain Input */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-semibold text-[#0F172A]">
                  Workspace Domain
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="your-company.atlassian.net"
                    className="w-full pl-10 pr-3.5 py-2.5 text-[13px] bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-[#0F172A] placeholder-[#94A3B8]"
                  />
                </div>
              </div>

              {/* Project / Board Name */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-semibold text-[#0F172A]">
                  Project Key or Board Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={projectKey}
                    onChange={(e) => setProjectKey(e.target.value)}
                    placeholder="e.g. ZENITH-BOARD"
                    className="w-full pl-10 pr-3.5 py-2.5 text-[13px] bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-[#0F172A] placeholder-[#94A3B8]"
                  />
                </div>
              </div>

              {/* API Token Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[12px] font-semibold text-[#0F172A]">
                    Atlassian API Token
                  </label>
                  <a
                    href="https://id.atlassian.com/manage-profile/security/api-tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Create token</span>
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
                    placeholder="Atlassian API Token"
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
                  onClick={closeJiraModal}
                  disabled={isPending}
                  className="px-4 py-2 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Connect Jira</span>
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
