'use client'

import React from 'react'
import { Settings, CheckCircle2, Users } from 'lucide-react'

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
  const members = [
    { name: 'Team Zenith', email: 'lead@projectpilot.ai', role: 'Lead' },
    { name: 'Aditi Sharma', email: 'aditi@projectpilot.ai', role: 'Member' },
    { name: 'Rohan Verma', email: 'rohan@projectpilot.ai', role: 'Member' },
    { name: 'Meera Iyer', email: 'meera@projectpilot.ai', role: 'Member' },
    { name: 'Kabir Mehta', email: 'kabir@projectpilot.ai', role: 'Member' },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#1F3864]" />
          Settings &amp; Integrations
        </h1>
        <p className="text-[13px] text-[#64748B] mt-0.5">
          Connect your GitHub repository, Jira workspace, and manage team access.
        </p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* GitHub Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1F3864] text-white flex items-center justify-center font-bold">
                <GitHubIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#0F172A]">GitHub Integration</h3>
                <p className="text-[12px] text-[#64748B]">dnm10/ProjectPilotAI</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Connected
            </span>
          </div>
          <p className="text-[12px] text-[#64748B]">
            Webhooks active for commit telemetry, PR reviews, and line-level risk checks.
          </p>
        </div>

        {/* Jira Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                Jira
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#0F172A]">Jira Software</h3>
                <p className="text-[12px] text-[#64748B]">ZENITH-BOARD (Sprint 3)</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Connected
            </span>
          </div>
          <p className="text-[12px] text-[#64748B]">
            Syncing sprint backlog, story points, ticket status transitions, and issue comments.
          </p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
        <h3 className="text-[15px] font-bold text-[#0F172A] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#4F46E5]" />
          Team Members (Lead Managed)
        </h3>

        <div className="divide-y divide-[#E2E8F0]">
          {members.map((m) => (
            <div key={m.email} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold text-[#0F172A]">{m.name}</p>
                <p className="text-[12px] text-[#64748B]">{m.email}</p>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  m.role === 'Lead'
                    ? 'bg-[#1F3864] text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}