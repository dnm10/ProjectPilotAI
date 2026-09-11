'use client'

import React from 'react'
import { TeamMember } from '@/types'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useCurrentUserRole } from '@/hooks/useTeamMembers'
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  Lock,
  Crown,
  User,
  Loader2,
  Activity,
} from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

interface TeamMembersCardProps {
  members?: TeamMember[]
  isLoading?: boolean
}

export default function TeamMembersCard({
  members = [],
  isLoading = false,
}: TeamMembersCardProps) {
  const { openEditRoleModal } = useSettingsStore()
  const { isLead, toggleRole } = useCurrentUserRole()

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
      {/* Header with Title & Active User RBAC Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-100 flex items-center justify-center shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#0F172A] flex items-center gap-2">
              Team Members
              <span className="text-[12px] font-normal text-[#64748B]">
                ({members.length} members)
              </span>
            </h3>
            <p className="text-[12px] text-[#64748B]">
              Role-Based Access Control &bull; Lead managed workspace permissions
            </p>
          </div>
        </div>

        {/* Current User Role Simulator / Switcher */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-slate-50 border border-[#E2E8F0] p-1.5 rounded-xl">
          <div className="flex items-center gap-1.5 px-2 text-[12px] text-[#64748B]">
            <span className="font-semibold text-[#0F172A]">My Role:</span>
          </div>

          <button
            type="button"
            onClick={toggleRole}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer shadow-2xs ${
              isLead
                ? 'bg-[#1F3864] text-white'
                : 'bg-white text-slate-700 border border-[#CBD5E1]'
            }`}
            title="Click to toggle between Lead and Member role simulation"
          >
            {isLead ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Lead (Admin)</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Member (Read-Only)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RBAC Notice Banner */}
      {!isLead && (
        <div className="flex items-center gap-2.5 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[12px] text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            You are currently viewing as a <strong>Member</strong>. Only workspace <strong>Leads</strong> have permission to edit team member roles. (Use the role toggle above to test Lead actions).
          </span>
        </div>
      )}

      {/* Members List */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#64748B]">
          <Loader2 className="w-6 h-6 animate-spin text-[#4F46E5]" />
          <p className="text-[13px]">Loading team members...</p>
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members registered"
          description="Workspace team members and roles will display here once added."
          className="border-dashed"
        />
      ) : (
        <div className="divide-y divide-[#E2E8F0]">
          {members.map((member) => {
            const isMemberLead = member.role_in_team === 'lead'

            return (
              <div
                key={member.id}
                className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
              >
                {/* User Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 shadow-xs ${
                      isMemberLead
                        ? 'bg-[#1F3864] text-white ring-2 ring-[#1F3864]/20'
                        : 'bg-indigo-50 text-[#4F46E5] border border-indigo-100'
                    }`}
                  >
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-bold text-[#0F172A] truncate">
                        {member.name}
                      </p>
                      {isMemberLead && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Crown className="w-2.5 h-2.5" />
                          Lead
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#64748B] truncate">{member.email}</p>
                  </div>
                </div>

                {/* Role Badge, Workload & Action */}
                <div className="flex items-center gap-3.5 self-end sm:self-auto">
                  {/* Workload */}
                  <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#64748B] bg-slate-100/70 px-2.5 py-1 rounded-lg">
                    <Activity className="w-3 h-3 text-[#4F46E5]" />
                    <span>Workload: {member.current_workload_percentage}%</span>
                  </div>

                  {/* Role Badge */}
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs ${
                      isMemberLead
                        ? 'bg-[#1F3864] text-white border border-[#1F3864]'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isMemberLead ? (
                      <>
                        <ShieldCheck className="w-3 h-3 text-white" />
                        Lead
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 text-slate-500" />
                        Member
                      </>
                    )}
                  </span>

                  {/* Edit Role Button (Lead-Only RBAC) */}
                  {isLead ? (
                    <button
                      type="button"
                      onClick={() => openEditRoleModal(member)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#4F46E5] hover:text-[#4338CA] bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200 rounded-lg transition-all cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Role</span>
                    </button>
                  ) : (
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed select-none"
                      title="Lead privileges required to modify roles"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Lead Only</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
