'use client'

import React from 'react'
import { Settings, Shield, RefreshCw } from 'lucide-react'
import {
  useIntegrations,
  useDisconnectGitHub,
  useDisconnectJira,
} from '@/hooks/useIntegrations'
import { useTeamMembers, useCurrentUserRole } from '@/hooks/useTeamMembers'
import { useSettingsStore } from '@/store/useSettingsStore'
import { toast } from '@/lib/toast'
import IntegrationCard from '@/components/features/settings/IntegrationCard'
import GitHubConnectModal from '@/components/features/settings/GitHubConnectModal'
import JiraConnectModal from '@/components/features/settings/JiraConnectModal'
import TeamMembersCard from '@/components/features/settings/TeamMembersCard'
import EditRoleModal from '@/components/features/settings/EditRoleModal'
import SettingsSkeleton from '@/components/features/settings/SettingsSkeleton'

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

export default function SettingsIntegrationsPage() {
  const { data: integrations, isLoading: isIntegrationsLoading } = useIntegrations()
  const { data: teamMembers, isLoading: isTeamLoading } = useTeamMembers()
  const { isLead } = useCurrentUserRole()

  const { openGitHubModal, openJiraModal } = useSettingsStore()
  const { mutate: disconnectGitHubMutation, isPending: isDisconnectingGh } = useDisconnectGitHub()
  const { mutate: disconnectJiraMutation, isPending: isDisconnectingJira } = useDisconnectJira()

  const handleDisconnectGitHub = () => {
    disconnectGitHubMutation(undefined, {
      onSuccess: () => {
        toast.info('GitHub repository disconnected', 'Integration Removed')
      },
    })
  }

  const handleDisconnectJira = () => {
    disconnectJiraMutation(undefined, {
      onSuccess: () => {
        toast.info('Jira workspace disconnected', 'Integration Removed')
      },
    })
  }

  const isPageLoading = isIntegrationsLoading && isTeamLoading

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#1F3864] flex items-center justify-center border border-[#E2E8F0] shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            Settings &amp; Integrations
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Manage repository webhooks, issue tracking pipelines, and team access permissions.
          </p>
        </div>

        {/* Global Status Chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs self-start sm:self-auto text-[12px] text-slate-700">
          <Shield className="w-3.5 h-3.5 text-[#1F3864]" />
          <span>Access Level:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded-md ${
              isLead ? 'bg-[#1F3864] text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isLead ? 'Lead Admin' : 'Team Member'}
          </span>
        </div>
      </div>

      {isPageLoading ? (
        <SettingsSkeleton />
      ) : (
        <>
          {/* Top Section: GitHub & Jira Cards Side by Side */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#64748B]">
                Connected Development Services
              </h2>
              <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-[#4F46E5]" />
                Real-time webhook telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* GitHub Integration Card */}
              <IntegrationCard
                config={integrations?.github}
                isLoading={isIntegrationsLoading}
                onConnect={openGitHubModal}
                onDisconnect={handleDisconnectGitHub}
                isDisconnecting={isDisconnectingGh}
                icon={<GitHubIcon className="w-6 h-6 text-[#1F3864]" />}
                description="Webhooks active for commit telemetry, pull request reviews, and line-level risk checks."
                features={[
                  'Commit velocity & diff telemetry',
                  'PR review status & code coverage delta',
                  'Automated closed-loop commit matching',
                ]}
              />

              {/* Jira Integration Card */}
              <IntegrationCard
                config={integrations?.jira}
                isLoading={isIntegrationsLoading}
                onConnect={openJiraModal}
                onDisconnect={handleDisconnectJira}
                isDisconnecting={isDisconnectingJira}
                icon={
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    Jira
                  </div>
                }
                description="Syncing sprint backlog, story points, ticket status transitions, and issue comments."
                features={[
                  'Live sprint backlog and burndown sync',
                  'Story point & ticket transition tracking',
                  'Monte Carlo schedule simulation data',
                ]}
              />
            </div>
          </div>

          {/* Bottom Section: Team Members Card */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#64748B]">
                Workspace Access &amp; Governance
              </h2>
            </div>

            <TeamMembersCard
              members={teamMembers}
              isLoading={isTeamLoading}
            />
          </div>
        </>
      )}

      {/* Dialog Modals */}
      <GitHubConnectModal />
      <JiraConnectModal />
      <EditRoleModal />
    </div>
  )
}